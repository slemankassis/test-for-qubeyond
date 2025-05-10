import React, { useState } from "react";
import { JokeList } from "./components/JokeList";
import { Navbar } from "./components/Navbar";
import "./App.css";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Joke API Explorer
        </h1>
        <JokeList darkMode={darkMode} />
      </main>
      <footer
        className={`py-4 text-center ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-600"}`}
      >
        <p>Joke API Explorer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
