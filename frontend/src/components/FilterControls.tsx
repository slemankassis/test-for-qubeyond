import React from "react";

interface FilterControlsProps {
  jokeTypes: string[];
  selectedType: string;
  onFilterChange: (type: string) => void;
  darkMode: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  jokeTypes,
  selectedType,
  onFilterChange,
  darkMode,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <label
        htmlFor="filter-type"
        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        Filter by type:
      </label>
      <select
        id="filter-type"
        value={selectedType}
        onChange={(e) => onFilterChange(e.target.value)}
        className={`px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-600"
            : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="all">All Types</option>
        {jokeTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {selectedType !== "all" && (
        <button
          onClick={() => onFilterChange("all")}
          className={`p-1 rounded-md focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-blue-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-blue-500"
          }`}
          aria-label="Clear filter"
          title="Clear filter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
