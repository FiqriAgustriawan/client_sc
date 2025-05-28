import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
    </div>
  );
};

export default SearchBar;