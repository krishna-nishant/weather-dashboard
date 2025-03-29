import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-indigo-600 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-500 flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

          <div className="relative p-6 sm:p-8">
            <Header />

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg transition-all duration-300">
              {children}
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;