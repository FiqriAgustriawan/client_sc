import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded col-span-1"></div>
            <div className="h-4 bg-gray-200 rounded col-span-1"></div>
            <div className="h-4 bg-gray-200 rounded col-span-1"></div>
            <div className="h-4 bg-gray-200 rounded col-span-1"></div>
            <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;