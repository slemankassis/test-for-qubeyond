import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Joke, PaginationInfo, SortOption } from "../types";
import { JokeCard } from "./JokeCard";
import { Pagination } from "./Pagination";
import { SortControls } from "./SortControls";
import { FilterControls } from "./FilterControls";
import { SearchBar } from "./SearchBar";
import JokeModal from "./JokeModal";

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedJoke, setSelectedJoke] = useState<Joke | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  // Create an Axios instance with caching headers
  const api = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Cache-Control": "max-age=300", // 5 minute cache
      },
    });
  }, []);

  const fetchJokes = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (isSearching && searchTerm) {
        response = await api.get(
          `/jokes/search?q=${encodeURIComponent(searchTerm)}`,
        );
      } else {
        response = await api.get(`/jokes/random/50`);
      }

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
  }, [isSearching, searchTerm, api]);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes, refreshTrigger]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenModal = (joke: Joke | null = null) => {
    setSelectedJoke(joke);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJoke(null);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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

  const handleRateJoke = useCallback(
    (id: string | undefined, rating: number) => {
      if (id === undefined) return;

      // Call the API to rate the joke
      api
        .post(`/jokes/${id}/rate`, {
          value: rating,
        })
        .then((response) => {
          // Update local state with the updated joke
          const updatedJoke = response.data;
          setJokes((prevJokes) =>
            prevJokes.map((joke) => (joke.id === id ? updatedJoke : joke)),
          );
        })
        .catch((err) => {
          console.error("Error rating joke:", err);
        });
    },
    [api],
  );

  return (
    <div className="space-y-8" aria-live="polite">
      <div className="sr-only" aria-live="assertive">
        {loading
          ? "Loading jokes..."
          : `${filteredJokes.length} jokes available`}
      </div>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-4">
        <SearchBar onSearch={handleSearch} darkMode={darkMode} />

        {isSearching && (
          <button
            onClick={clearSearch}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Clear Search
          </button>
        )}

        <div className="flex items-center gap-4">
          <FilterControls
            jokeTypes={jokeTypes}
            selectedType={selectedType}
            onFilterChange={handleFilterChange}
            darkMode={darkMode}
          />

          <button
            onClick={() => handleOpenModal()}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Add Joke
          </button>
        </div>

        <SortControls
          sortOption={sortOption}
          onSortChange={handleSortChange}
          darkMode={darkMode}
        />
      </div>

      {loading && (
        <div
          className="flex justify-center items-center py-8"
          role="status"
          aria-label="Loading jokes"
        >
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-white" : "border-gray-900"}`}
            aria-hidden="true"
          ></div>
        </div>
      )}

      {error && (
        <div
          className={`text-center p-4 rounded-lg ${darkMode ? "bg-red-900 text-white" : "bg-red-100 text-red-700"}`}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {!loading && !error && filteredJokes.length === 0 && (
        <div
          className={`text-center p-8 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
          role="status"
          aria-live="polite"
        >
          {isSearching
            ? `No jokes found for "${searchTerm}". Try a different search term.`
            : "No jokes found. Try changing your filters."}
        </div>
      )}

      {!loading && !error && filteredJokes.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            role="feed"
            aria-busy={loading}
          >
            {getCurrentJokes().map((joke) => (
              <JokeCard
                key={joke.id}
                joke={joke}
                onRate={handleRateJoke}
                onEdit={() => handleOpenModal(joke)}
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

      {showModal && (
        <JokeModal
          joke={selectedJoke}
          onClose={handleCloseModal}
          onRefresh={handleRefresh}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};
