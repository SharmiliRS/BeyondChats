import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">BeyondChats</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 ${
                location.pathname === '/' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              } transition`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/articles"
              className={`${
                location.pathname === '/articles' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              } transition`}
            >
              Articles
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;