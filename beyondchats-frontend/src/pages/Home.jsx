import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

const Home = () => {
  const { articles, loading } = useArticles();

  // Get latest 5 articles
  const latestArticles = articles.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            BeyondChats Articles
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Displaying articles fetched from Laravel API
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
            <Link
              to="/articles"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : latestArticles.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No articles available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
                >
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href={article.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-sm text-gray-500">
                      {article.is_updated ? 'AI Enhanced' : 'Original'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;