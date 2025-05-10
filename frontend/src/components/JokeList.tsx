import React, { useState, useEffect } from "react";
import axios from "axios";
import { Joke, PaginationInfo, SortOption } from "../types";
import { JokeCard } from "./JokeCard";
import { Pagination } from "./Pagination";
import { SortControls } from "./SortControls";
import { FilterControls } from "./FilterControls";

interface JokeListProps {
  darkMode: boolean;
}

export const JokeList: React.FC<JokeListProps> = ({ darkMode }) => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [filteredJokes, setFilteredJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jokeTypes, setJokeTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: "setup",
    direction: "asc",
  });

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3005/jokes/random/50",
        );

        const jokesWithRating = response.data.map((joke: Joke) => ({
          ...joke,
          rating: joke.rating || 0,
          votes: joke.votes || 0,
        }));

        setJokes(jokesWithRating);

        const types = [
          ...new Set(jokesWithRating.map((joke: Joke) => joke.type)),
        ] as string[];
        setJokeTypes(types);

        setError(null);
      } catch (err) {
        setError("Failed to fetch jokes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();
  }, []);

  useEffect(() => {
    let result = [...jokes];

    if (selectedType !== "all") {
      result = result.filter((joke) => joke.type === selectedType);
    }

    result.sort((a, b) => {
      const field = sortOption.field;

      if (field === "rating") {
        return sortOption.direction === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }

      if (field === "type") {
        return sortOption.direction === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }

      return sortOption.direction === "asc"
        ? a.setup.localeCompare(b.setup)
        : b.setup.localeCompare(a.setup);
    });

    setFilteredJokes(result);

    setPagination((prev) => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.pageSize),
      currentPage: 1,
    }));
  }, [jokes, selectedType, sortOption]);

  const getCurrentJokes = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredJokes.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
  };

  const handleRateJoke = (id: number | undefined, rating: number) => {
    if (id === undefined) return;

    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke.id === id
          ? {
              ...joke,
              rating:
                ((joke.rating || 0) * (joke.votes || 0) + rating) /
                ((joke.votes || 0) + 1),
              votes: (joke.votes || 0) + 1,
            }
          : joke,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <FilterControls
          jokeTypes={jokeTypes}
          selectedType={selectedType}
          onFilterChange={handleFilterChange}
          darkMode={darkMode}
        />
        <SortControls
          sortOption={sortOption}
          onSortChange={handleSortChange}
          darkMode={darkMode}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-white" : "border-gray-900"}`}
          ></div>
        </div>
      )}

      {error && (
        <div
          className={`text-center p-4 rounded-lg ${darkMode ? "bg-red-900 text-white" : "bg-red-100 text-red-700"}`}
        >
          {error}
        </div>
      )}

      {!loading && !error && filteredJokes.length === 0 && (
        <div
          className={`text-center p-8 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
        >
          No jokes found. Try changing your filters.
        </div>
      )}

      {!loading && !error && filteredJokes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getCurrentJokes().map((joke) => (
              <JokeCard
                key={joke.id}
                joke={joke}
                onRate={handleRateJoke}
                darkMode={darkMode}
              />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
};
