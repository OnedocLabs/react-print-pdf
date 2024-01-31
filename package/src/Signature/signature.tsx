import React from "react";

import { TrackBox } from "../TrackBox/trackbox";
import { SIGNATURE_PREFIX, SigTypes } from "../extensions/signatureconstants";

export const Signature = ({
  company,
  representative,
  tag,
}: {
  company?: string;
  representative?: string;
  tag: SigTypes;
}) => {
  return (
    <div className="border-b border-b-black h-48 whitespace-pre-wrap flex flex-col">
      {company && <div className="text-xs text-gray-400 pb-1">{company}</div>}
      {representative && <div className="text-sm">{representative}</div>}
      <div className="h-4" />
      <TrackBox tag={`${SIGNATURE_PREFIX}${tag}`} className="flex-grow" />
    </div>
  );
};

// export const Signatures = ({ children }) => {
//   return (
//     <div className="flex flex-wrap -mx-2 pt-4 break-inside-avoid">
//       {children.map((child, index) => (
//         <div key={index} className="w-1/2 box-border pb-4">
//           <div className="px-2">{child}</div>
//         </div>
//       ))}
//     </div>
//   );
// };
