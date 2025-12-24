import React from 'react';
import { useArticles } from '../hooks/useArticles';
import { FileText, ExternalLink, Globe, AlertCircle, RefreshCw } from 'lucide-react';

const Articles = () => {
  const { articles, loading, error, refresh } = useArticles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Articles</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">BeyondChats Articles</h1>
                <p className="text-gray-400">
                  Showing {articles.length} article{articles.length !== 1 ? 's' : ''} from Laravel API
                </p>
              </div>
            </div>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-gray-400">No articles in the database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
              >
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {article.description || 'No description available'}
                </p>

                {/* Source Link */}
                {article.slug && (
                  <a
                    href={article.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Original Source</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Meta Info */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {article.is_updated ? 'AI Enhanced' : 'Original'}
                    </span>
                    <span>
                      {article.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;