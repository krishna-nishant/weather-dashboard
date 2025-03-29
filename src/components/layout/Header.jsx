import React from "react";
import ThemeToggle from "../ui/theme-toggle";
import { Github, User } from "lucide-react";

function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white dark:text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-blue-100 dark:to-white">
          Weather Forecast
        </span>
      </h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="https://github.com/krishna-nishant/weather-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200 hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="View GitHub Repository"
        >
          <Github size={20} />
        </a>
        <a
          href="https://krishna-nishant.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200 hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="View Portfolio"
        >
          <User size={20} />
        </a>
      </div>
    </div>
  );
}

export default Header;
