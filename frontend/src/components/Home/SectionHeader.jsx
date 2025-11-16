import React from "react";
import { ChevronRight } from "lucide-react";

const SectionHeader = ({ title, actionText, onActionPress }) => {
  return (
    <div className="flex items-center justify-between px-4 mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {actionText && (
        <button
          onClick={onActionPress}
          className="flex items-center text-red-600 hover:text-red-700 transition-colors"
        >
          <span className="text-sm font-semibold mr-1">{actionText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
