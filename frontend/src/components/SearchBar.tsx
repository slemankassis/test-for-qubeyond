import React, { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  darkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md">
      <input
        type="text"
        placeholder="Search jokes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full px-4 py-2 rounded-l-md focus:outline-none ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        }`}
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-r-md ${
          darkMode
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Search
      </button>
    </form>
  );
};
