import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  BookOpen,
  Globe
} from 'lucide-react';

const ArticleCard = ({ article, index, viewMode = 'grid' }) => {
  const [hovered, setHovered] = useState(false);
  
  // Format date from Laravel timestamp
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate read time from description/content
  const getReadTime = () => {
    const content = article.content || article.description || '';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Get content to display
  const getContent = () => {
    if (article.content) return article.content;
    if (article.description) return article.description;
    return 'No content available';
  };

  // Truncate text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get article type badge
  const getTypeBadge = () => {
    if (article.is_updated) {
      return {
        text: 'AI Enhanced',
        icon: RefreshCw,
        color: 'secondary',
        bgColor: 'bg-secondary-500/10',
        textColor: 'text-secondary-400',
        borderColor: 'border-secondary-500/20'
      };
    } else {
      return {
        text: 'Original',
        icon: Sparkles,
        color: 'emerald',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/20'
      };
    }
  };

  // List View
  if (viewMode === 'list') {
    const badge = getTypeBadge();
    const BadgeIcon = badge.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Type Badge */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 rounded-xl ${badge.bgColor} ${badge.borderColor} border flex flex-col items-center justify-center`}>
              <BadgeIcon className={`w-6 h-6 ${badge.textColor} mb-1`} />
              <span className={`text-xs font-medium ${badge.textColor}`}>
                {badge.text}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                <Link to={`/article/${article.id}`} className="hover:underline">
                  {article.title || 'Untitled Article'}
                </Link>
              </h3>
              
              {/* References count */}
              {article.references && article.references.length > 0 && (
                <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {article.references.length} refs
                </span>
              )}
            </div>
            
            <p className="text-gray-400 mb-4 line-clamp-2">
              {truncateText(getContent(), 200)}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getReadTime()}</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} views</span>
                </div>
              )}
              {article.slug && (
                <a 
                  href={article.slug} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-4 h-4" />
                  <span>Source</span>
                </a>
              )}
            </div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-900/50 text-gray-300 text-xs rounded-full border border-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link
              to={`/article/${article.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-primary-500/50 hover:text-white transition-all duration-300"
            >
              <span>Read Article</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (Default)
  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.bgColor} ${badge.textColor} ${badge.borderColor} border`}>
              <BadgeIcon className="w-3 h-3" />
              {badge.text}
            </span>
            
            {/* References badge */}
            {article.references && article.references.length > 0 && (
              <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {article.references.length} references
              </span>
            )}
          </div>
          
          {/* External link to source */}
          {article.slug && (
            <a 
              href={article.slug} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-700/50 rounded transition-colors"
              title="View original source"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-primary-400" />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-300 transition-colors line-clamp-2">
          <Link to={`/article/${article.id}`} className="hover:underline">
            {article.title || 'Untitled Article'}
          </Link>
        </h3>

        {/* Content */}
        <div className="flex-grow mb-4">
          <p className="text-gray-400 text-sm line-clamp-3">
            {truncateText(getContent())}
          </p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-900/50 text-gray-300 text-xs rounded-full border border-gray-700"
                >
                  #{tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{article.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getReadTime()}</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} views</span>
                </div>
              )}
            </div>
            
            <Link
              to={`/article/${article.id}`}
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group-hover:gap-3"
            >
              <span>Read Full</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hover effect line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;