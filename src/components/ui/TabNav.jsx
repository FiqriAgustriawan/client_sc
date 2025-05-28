import React from "react";

const TabNav = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default TabNav;