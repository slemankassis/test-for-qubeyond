import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Joke } from "../types";

interface JokeModalProps {
  joke: Joke | null;
  onClose: () => void;
  onRefresh: () => void;
  darkMode: boolean;
}

export const JokeModal: React.FC<JokeModalProps> = ({
  joke,
  onClose,
  onRefresh,
  darkMode,
}) => {
  const [type, setType] = useState<string>("general");
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!joke;

  useEffect(() => {
    if (joke) {
      setType(joke.type);
      setSetup(joke.setup);
      setPunchline(joke.punchline);
    } else {
      setType("general");
      setSetup("");
      setPunchline("");
    }
  }, [joke]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      type,
      setup,
      punchline,
    };

    try {
      if (isEditMode && joke && joke.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/jokes/${joke.id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/jokes`, payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to save joke:", err);
      setError("Failed to save joke. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`rounded-lg shadow-xl w-full max-w-md mx-4 relative ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Joke" : "Add New Joke"}
          </h2>
          <button
            onClick={onClose}
            className={`text-2xl ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            } transition`}
          >
            &times;
          </button>
        </div>

        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Joke Type</label>
            <select
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="general">General</option>
              <option value="programming">Programming</option>
              <option value="knock-knock">Knock-Knock</option>
              <option value="dad">Dad Joke</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Setup</label>
            <input
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              type="text"
              placeholder="What's the setup for your joke?"
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Punchline</label>
            <textarea
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="The punchline goes here..."
              value={punchline}
              onChange={(e) => setPunchline(e.target.value)}
              rows={3}
              required
            />
          </div>

          {error && (
            <div
              className={`p-2 rounded ${
                darkMode ? "bg-red-900 text-white" : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : isEditMode ? "Update Joke" : "Add Joke"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JokeModal;
