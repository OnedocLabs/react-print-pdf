import {
  PDFAcroSignature,
  PDFSignature,
  AnnotationFlags,
  PDFWidgetAnnotation,
  PDFDocument,
} from "pdf-lib";
import type { BoxTrackingOutput, Box } from "../boxTracking";

import { SIGNATURE_PREFIX, SigTypes } from "./signatureconstants";

const addSignaturePlaceholder = (
  pdfFile: PDFDocument,
  box: Box,
  name: SigTypes
) => {
  // TODO: allow initials which are potentially present multiple times.
  const pdfPage = pdfFile.getPages()[box.pageNum - 1];
  const signatureDict = pdfPage.doc.context.obj({
    FT: "Sig",
    Kids: [],
    T: name,
  });

  const signatureDictRef = pdfPage.doc.context.register(signatureDict);

  // From PDFForm::createTextField()
  const acroSigField = PDFAcroSignature.fromDict(
    signatureDict,
    signatureDictRef
  );
  acroSigField.setPartialName(name);

  // From PDFForm::createTextField() -> addFieldToParent()
  pdfPage.doc.getForm().acroForm.addField(acroSigField.ref);

  const sigField = PDFSignature.of(acroSigField, acroSigField.ref, pdfPage.doc);

  // From PDFTextField::addToPage()
  const sigWidget = PDFWidgetAnnotation.create(
    pdfPage.doc.context,
    sigField.ref
  );

  // From PDFTextField::addToPage() -> PDFField::createWidget()
  sigWidget.setRectangle({
    x: box.x,
    y: box.y - box.h,
    width: box.w,
    height: box.h,
  });
  sigWidget.setP(pdfPage.ref);
  sigWidget.setFlagTo(AnnotationFlags.Print, true);
  sigWidget.setFlagTo(AnnotationFlags.Hidden, false);
  sigWidget.setFlagTo(AnnotationFlags.Invisible, false);

  const sigWidgetRef = pdfPage.doc.context.register(sigWidget.dict);

  sigField.acroField.addWidget(sigWidgetRef);

  pdfPage.node.addAnnot(sigWidgetRef);
};

export const createSignatures = async (
  pdfDocument: PDFDocument,
  boxTracking: BoxTrackingOutput
) => {
  // Filter the box tracking output to only include signatures
  const signatures = Object.entries(boxTracking)
    .filter(([tag, _]) => {
      return tag.startsWith(SIGNATURE_PREFIX);
    })
    .map(([tag, box]) => {
      const signature = tag.replace(SIGNATURE_PREFIX, "");

      // Select the box with the largest width times height
      const boxWithLargestArea = box.boxes.reduce(
        (acc, box) => {
          const area = box.w * box.h;

          if (area >= acc.area) {
            acc.area = area;
            acc.box = box;
          }

          return acc;
        },
        { area: 0, box: null as unknown as Box }
      );

      // Warn if the area of the box is 0
      if (boxWithLargestArea.area === 0) {
        console.warn(
          `No valid box found for signature "${signature}" in file, the area of the box is 0`
        );
      }

      // Warn if there are multiple boxes
      if (box.boxes.length > 1) {
        console.warn(
          `Multiple boxes found for signature "${signature}" in file, using the box with the largest area`
        );
      }

      return {
        signature,
        box: boxWithLargestArea.box,
      } as {
        signature: SigTypes;
        box: Box;
      };
    });

  signatures.forEach((signature) => {
    addSignaturePlaceholder(pdfDocument, signature.box, signature.signature);
  });
};
