import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-blue-500 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;