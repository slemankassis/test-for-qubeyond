import React, {
  useState,
  useEffect,
  FormEvent,
  useRef,
  useCallback,
} from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  const isEditMode = !!joke;

  // When modal opens, focus the first input field
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Add escape key handler
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Set up form field values based on joke prop
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

  // Memoize submit handler to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      // Validate form fields
      if (!setup.trim()) {
        setError("Setup is required");
        setLoading(false);
        return;
      }

      if (!punchline.trim()) {
        setError("Punchline is required");
        setLoading(false);
        return;
      }

      const payload = {
        type,
        setup: setup.trim(),
        punchline: punchline.trim(),
      };

      try {
        if (isEditMode && joke && joke.id) {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/jokes/${joke.id}`,
            payload,
          );
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
    },
    [isEditMode, joke, onClose, onRefresh, punchline, setup, type],
  );

  // Close modal when clicking outside
  const handleOutsideClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={modalRef}
        className={`rounded-lg shadow-xl w-full max-w-md mx-4 relative ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 id="dialog-title" className="text-xl font-semibold">
            {isEditMode ? "Edit Joke" : "Add New Joke"}
          </h2>
          <button
            onClick={onClose}
            className={`text-2xl ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            } transition focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <form className="p-4 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="joke-type" className="block mb-1">
              Joke Type
            </label>
            <select
              ref={firstInputRef}
              id="joke-type"
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <label htmlFor="joke-setup" className="block mb-1">
              Setup
            </label>
            <input
              id="joke-setup"
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              type="text"
              placeholder="What's the setup for your joke?"
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          <div>
            <label htmlFor="joke-punchline" className="block mb-1">
              Punchline
            </label>
            <textarea
              id="joke-punchline"
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="The punchline goes here..."
              value={punchline}
              onChange={(e) => setPunchline(e.target.value)}
              rows={3}
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          {error && (
            <div
              id="form-error"
              className={`p-2 rounded ${
                darkMode ? "bg-red-900 text-white" : "bg-red-100 text-red-700"
              }`}
              role="alert"
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
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-busy={loading}
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
