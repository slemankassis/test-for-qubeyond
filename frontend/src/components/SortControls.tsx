import React from "react";
import { SortOption, SortField } from "../types";

interface SortControlsProps {
  sortOption: SortOption;
  onSortChange: (newSortOption: SortOption) => void;
  darkMode: boolean;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortOption,
  onSortChange,
  darkMode,
}) => {
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({
      ...sortOption,
      field: e.target.value as SortField,
    });
  };

  const handleDirectionChange = () => {
    onSortChange({
      ...sortOption,
      direction: sortOption.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <label
        htmlFor="sort-field"
        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        Sort by:
      </label>
      <select
        id="sort-field"
        value={sortOption.field}
        onChange={handleFieldChange}
        className={`px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-600"
            : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="setup">Joke Text</option>
        <option value="type">Type</option>
        <option value="rating">Rating</option>
      </select>
      <button
        onClick={handleDirectionChange}
        className={`p-1 rounded-md focus:outline-none focus:ring-2 ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-blue-600"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-blue-500"
        }`}
        aria-label={`Sort ${sortOption.direction === "asc" ? "ascending" : "descending"}`}
      >
        {sortOption.direction === "asc" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
