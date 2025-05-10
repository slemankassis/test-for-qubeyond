import React, { useState } from "react";
import { Joke } from "../types";

interface JokeCardProps {
  joke: Joke;
  onRate: (id: string | undefined, rating: number) => void;
  onEdit?: () => void;
  darkMode: boolean;
}

export const JokeCard: React.FC<JokeCardProps> = ({
  joke,
  onRate,
  onEdit,
  darkMode,
}) => {
  const [showPunchline, setShowPunchline] = useState(false);
  const [justRated, setJustRated] = useState(false);

  const togglePunchline = () => {
    setShowPunchline(!showPunchline);
  };

  const handleRate = (rating: number) => {
    onRate(joke.id, rating);
    setJustRated(true);

    setTimeout(() => {
      setJustRated(false);
    }, 2000);
  };

  const formatRating = (rating: number | undefined) => {
    if (rating === undefined) return "No ratings";

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    let stars = "★".repeat(fullStars);
    if (hasHalfStar) stars += "½";
    stars += "☆".repeat(5 - Math.ceil(rating));

    return stars;
  };

  return (
    <div
      className={`relative rounded-lg shadow-md overflow-hidden transition-all duration-300
        ${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"}`}
    >
      <div
        className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full
        ${
          joke.type === "programming"
            ? "bg-blue-500 text-white"
            : joke.type === "knock-knock"
              ? "bg-purple-500 text-white"
              : "bg-green-500 text-white"
        }`}
      >
        {joke.type}
      </div>

      <div className="p-6 pt-8">
        <h3
          className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {joke.setup}
        </h3>

        {showPunchline ? (
          <p
            className={`text-lg italic mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {joke.punchline}
          </p>
        ) : (
          <button
            onClick={togglePunchline}
            className={`w-full py-2 mb-6 text-center rounded ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Reveal Punchline
          </button>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Rating:
              <span
                className={`ml-1 ${
                  (joke.rating || 0) > 3
                    ? "text-yellow-500"
                    : darkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                }`}
              >
                {formatRating(joke.rating)} ({joke.votes || 0})
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className={`text-xs px-2 py-1 rounded ${
                  darkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Edit
              </button>
            )}

            {showPunchline && (
              <button
                onClick={togglePunchline}
                className={`text-xs ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Hide
              </button>
            )}
          </div>
        </div>

        {showPunchline && !justRated && (
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    darkMode
                      ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                      : "bg-gray-200 text-yellow-500 hover:bg-gray-300"
                  }`}
                aria-label={`Rate ${rating} star${rating !== 1 ? "s" : ""}`}
              >
                {rating}
              </button>
            ))}
          </div>
        )}

        {justRated && (
          <div className="mt-4 text-center">
            <p
              className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"}`}
            >
              Thanks for rating this joke!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
