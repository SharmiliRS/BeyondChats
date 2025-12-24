import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useArticles } from '../hooks/useArticles';
import { 
  TrendingUp, 
  BarChart3, 
  Filter,
  GitBranch,
  Star,
  Clock,
  Calendar,
  Eye,
  BookOpen,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TimelineView = () => {
  const { articles, loading, filter, setFilter } = useArticles();
  const [timelineData, setTimelineData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (articles.length > 0) {
      const groupedByDate = articles.reduce((acc, article) => {
        const date = new Date(article.created_at).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(article);
        return acc;
      }, {});

      const timeline = Object.entries(groupedByDate)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, items]) => ({
          date,
          items,
          count: items.length
        }));

      setTimelineData(timeline);
    }
  }, [articles]);

  const stats = {
    total: articles.length,
    original: articles.filter(a => !a.is_updated).length,
    updated: articles.filter(a => a.is_updated).length,
    withReferences: articles.filter(a => a.references && a.references.length > 0).length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8 px-4 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30">
                  <GitBranch className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Article Evolution Timeline
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Track how articles evolve from original to AI-enhanced versions
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Articles', value: stats.total, icon: BarChart3, color: 'from-primary-500 to-blue-500' },
                { label: 'Original', value: stats.original, icon: Star, color: 'from-emerald-500 to-green-500' },
                { label: 'Updated', value: stats.updated, icon: TrendingUp, color: 'from-secondary-500 to-pink-500' },
                { label: 'With Refs', value: stats.withReferences, icon: Filter, color: 'from-amber-500 to-yellow-500' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {['all', 'original', 'updated'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-secondary-500 to-transparent hidden lg:block"></div>

          {timelineData.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="mb-12"
            >
              {/* Date Marker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-bold text-white">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {day.count} article{day.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {day.items.map((article, articleIndex) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (dayIndex + articleIndex) * 0.05 }}
                    onClick={() => setSelectedArticle(article)}
                    className="cursor-pointer group"
                  >
                    <div className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 overflow-hidden
                      ${article.is_updated 
                        ? 'border-secondary-500/30 hover:border-secondary-500/50' 
                        : 'border-emerald-500/30 hover:border-emerald-500/50'
                      } hover:shadow-xl hover:-translate-y-1`}
                    >
                      {/* Background Glow */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
                        ${article.is_updated 
                          ? 'bg-gradient-to-br from-secondary-500/10 to-pink-500/10' 
                          : 'bg-gradient-to-br from-emerald-500/10 to-green-500/10'
                        }`}></div>

                      {/* Article Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                            ${article.is_updated 
                              ? 'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {article.is_updated ? '🔄 Updated' : '📝 Original'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(article.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Article Content */}
                      <h4 className="text-lg font-bold text-white mb-3 group-hover:text-primary-300 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getReadTime(article.content)}</span>
                        </div>
                        {article.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views} views</span>
                          </div>
                        )}
                        {article.references && article.references.length > 0 && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{article.references.length} refs</span>
                          </div>
                        )}
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${selectedArticle.is_updated 
                    ? 'bg-gradient-to-br from-secondary-500/20 to-pink-500/20 border border-secondary-500/30' 
                    : 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30'
                  }`}
                >
                  {selectedArticle.is_updated ? '🔄' : '📝'}
                </div>
                <h2 className="text-xl font-bold text-white line-clamp-2">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <p className="text-gray-300 mb-6">
                {selectedArticle.content.substring(0, 300)}...
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Type</div>
                  <div className={`font-medium ${selectedArticle.is_updated ? 'text-secondary-400' : 'text-emerald-400'}`}>
                    {selectedArticle.is_updated ? 'Updated Version' : 'Original Article'}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Read Time</div>
                  <div className="font-medium text-white">{getReadTime(selectedArticle.content)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Created: {new Date(selectedArticle.created_at).toLocaleString()}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/article/${selectedArticle.id}`}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 text-center"
                >
                  View Full Article
                </Link>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {articles.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <GitBranch className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No articles yet</h3>
          <p className="text-gray-400 mb-6">Start creating articles to see the timeline</p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;