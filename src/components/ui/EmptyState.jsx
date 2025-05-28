import React from "react";
import Link from "next/link";

const EmptyState = ({ icon, title, description, actionText, actionLink }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && actionLink && (
        <Link href={actionLink}>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
            {actionText}
          </button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
