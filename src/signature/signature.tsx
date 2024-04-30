import { Tailwind } from "../tailwind/tailwind";
import { DocConfig } from "docgen/types";
import React from "react";

// This provides a loose support for DocuSign fields
const availableFields = {
  signHere: "eSignSignHere",
  signHereOptional: "eSignSignHereOptional",
  signInitialHere: "eSignInitialHere",
  signInitialHereOptional: "eSignInitialHereOptional",
  company: "eSignCompany",
  dateSigned: "eSignDateSigned",
  title: "eSignTitle",
  fullName: "eSignFullName",
  lastName: "eSignLastName",
  firstName: "eSignFirstName",
  emailAddress: "eSignEmailAddress",
  number: "eSignNumber",
  date: "eSignDate",
  ssn: "eSignSSN",
  zip5: "eSignZIP5",
  zip5dash4: "eSignZIP5DASH4",
  note: "eSignNote",
  list: "eSignList",
  checkbox: "eSignCheckbox",
  radio: "eSignRadio",
  approve: "eSignApprove",
  decline: "eSignDecline",
  view: "eSignView",
  signerAttachment: "eSignSignerAttachment",
  signerAttachmentOptional: "eSignSignerAttachmentOptional",
};

type fieldTypes = keyof typeof availableFields;

export const Field = ({
  type,
  signee,
  ...props
}: {
  type: fieldTypes;
  signee: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      name={availableFields[type]}
      type={
        type === "radio" ? "radio" : type === "checkbox" ? "checkbox" : "text"
      }
      data-onedoc-sign={type}
      className={`--onedoc-signature-field --onedoc-signature-field-${type} ${props.className || ""}`}
    />
  );
};

export const __docConfig: DocConfig = {
  name: "Signature",
  icon: "signature",
  description: `Add signature fields to your document. You can specify various types of fields like signature, initials, date, and more.

<Warning>
Signature and form filling are currently only available to select customers. If you would like to use these features in your project, please reach out at contact@onedoclabs.com.
</Warning>
`,
  components: {
    Field: {
      client: true,
      server: true,
      examples: {
        default: {
          description: `The created fields can be signed as-is in Acrobat Reader or other PDF viewers, using Onedoc's signature API, or through other e-signature services like [DocuSign](https://developers.docusign.com/docs/esign-rest-api/esign101/concepts/tabs/pdf-transform/).

Supported fields:

| Field Type | Description |
|------------|-------------|
| signHere | Signature field |
| signHereOptional | Optional signature field |
| signInitialHere | Initials field |
| signInitialHereOptional | Optional initials field |
| company | Company name field |
| dateSigned | Date signed field |
| title | Title field |
| fullName | Full name field |
| lastName | Last name field |
| firstName | First name field |
| emailAddress | Email address field |
| number | Number field |
| date | Date field |
| ssn | Social Security Number field |
| zip5 | ZIP code field |
| zip5dash4 | ZIP code with 4-digit extension field |
| note | Note field |
| list | List field |
| checkbox | Checkbox field |
| radio | Radio button field |
| approve | Approve button field |
| decline | Decline button field |
| view | View button field |
| signerAttachment | Signer attachment field |
| signerAttachmentOptional | Optional signer attachment field |`,
          template: (
            <>
              <Tailwind>
                <h2 className="text-xl font-bold mb-4">Signature</h2>
                <div className="p-4 rounded-md border border-gray-200">
                  By
                  <br />
                  <Field
                    type="fullName"
                    signee="sender"
                    defaultValue="John Doe"
                    className="border-b border-b-gray-300"
                  />
                  <br />
                  <Field
                    type="dateSigned"
                    signee="sender"
                    defaultValue="04/18/2024"
                    className="border-b border-b-gray-300"
                  />
                  <br />
                  <Field
                    type="signHere"
                    signee="sender"
                    className="border border-gray-300 h-48"
                  />
                </div>
              </Tailwind>
            </>
          ),
        },
      },
    },
  },
};
