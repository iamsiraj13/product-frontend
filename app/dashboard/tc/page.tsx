"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function TermsAndConditionsPage() {
  const handleSupportClick = () => {
    toast.info("Connecting to HNI Support...");
  };

  const termsList = [
    "Every new evaluator needs to deposit $20 to authorize the account.",
    "Evaluator must ensure all furniture products have been successfully uploaded to the database before requesting redemption or account closure; otherwise, the request will be considered invalid.",
    "Each phone number may only be used to register one account. If duplicate use of the same number is detected by the system, the platform reserves the right to unilaterally freeze the account and permanently prohibit the account holder from working on the platform.",
    "Evaluator must take responsibility for the confidentiality of their platform account and password. The platform will not compensate for any losses caused by evaluator negligence.",
    "All furniture and home decor products are automatically matched to the evaluator account activity recorded by the system and distributed randomly to qualifying accounts, ensuring every evaluator can perform their duty in a fair and harmonious platform environment, perfectly execute the evaluation of home furnishing products, and receive reasonable commission remuneration according to the conditions of merchants from all levels.",
    "To ensure fairness and equality among all cooperating merchants, the platform randomly distributes home furnishing products from 30 different merchants to each evaluator to promote the long-term operation of this strategy in a harmonious and balanced environment.",
    "Each Merchant is allowed to upload up to two newly added products. Additionally, a maximum of two Merchant may upload newly added products within a single dataset",
    "Withdrawal eligibility is granted once a member has successfully completed 31 data uploads on their account. Upon meeting this requirement, the member may submit a withdrawal request",
    "Members are required to upload their datasets in a timely manner. All members must fulfill the merchant's requirements by submitting data promptly to ensure smooth operations and to prevent any potential losses to the merchant.",
    "If a member is unable to complete their assigned work for the current day, they must notify the Support Team and request an extension. This will allow the merchant to be informed and the necessary arrangements to be made accordingly.",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900 tracking-wider uppercase">
          HNI CORPORATION
        </h1>
        <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">
          Terms & Conditions
        </p>
      </div>

      {/* Terms & Conditions Main Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xs">
        <ul className="space-y-4 sm:space-y-5">
          {termsList.map((term, index) => (
            <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              <span className="text-gray-900 font-bold text-base leading-none select-none shrink-0 mt-0.5">
                •
              </span>
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
}
