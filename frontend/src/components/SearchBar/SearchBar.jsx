import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  onKeyDown,
}) => {
  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="w-80 flex items-center px-4 bg-white rounded-md">
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-sm bg-transparent py-2 outline-none"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      {value && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={handleClear}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-[#ffda03]"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
