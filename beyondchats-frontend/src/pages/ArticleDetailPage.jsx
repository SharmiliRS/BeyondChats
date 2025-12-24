import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArticles } from '../hooks/useArticles';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Share2,
  Bookmark,
  Printer,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Globe,
  BookOpen
} from 'lucide-react';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticle } = useArticles();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showReferences, setShowReferences] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticle(id);
        setArticle(data);
      } catch (err) {
        setError('Failed to load article from Laravel API');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id, getArticle]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate read time
  const getReadTime = () => {
    if (!article) return '1 min read';
    const content = article.content || article.description || '';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Get content to display
  const getContent = () => {
    if (!article) return '';
    if (article.content) return article.content;
    if (article.description) return article.description;
    return 'No content available';
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: getContent().substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading article from Laravel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{error || 'Article not found'}</h3>
          <p className="text-gray-400 mb-6">
            Could not fetch article with ID: {id}
          </p>
          <button 
            onClick={() => navigate('/articles')} 
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 inline-block mr-2" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/articles')} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-primary-500/50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-300" />
            </button>
            <button 
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
              title={copied ? "Copied!" : "Copy link"}
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-300" />}
            </button>
            <button 
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
              title="Print"
            >
              <Printer className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Article Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Article Type Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              article.is_updated 
                ? 'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {article.is_updated ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  AI Enhanced Article (Phase 2)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Original Article (Phase 1)
                </>
              )}
            </div>
            
            {/* Source Link */}
            {article.slug && (
              <a 
                href={article.slug} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                View Original Source
              </a>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Published</div>
              <div className="flex items-center gap-2 font-medium text-white">
                <Calendar className="w-4 h-4" />
                {formatDate(article.created_at)}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Read Time</div>
              <div className="flex items-center gap-2 font-medium text-white">
                <Clock className="w-4 h-4" />
                {getReadTime()}
              </div>
            </div>
            
            {article.views > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Views</div>
                <div className="flex items-center gap-2 font-medium text-white">
                  <Eye className="w-4 h-4" />
                  {article.views} views
                </div>
              </div>
            )}
            
            {article.references && article.references.length > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">References</div>
                <div className="flex items-center gap-2 font-medium text-white">
                  <BookOpen className="w-4 h-4" />
                  {article.references.length} sources
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="bg-gray-800/30 rounded-2xl p-6 lg:p-8 mb-8">
            <ReactMarkdown className="text-gray-300 leading-relaxed">
              {getContent()}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700 hover:border-primary-500/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {article.references && article.references.length > 0 && (
            <div className="mb-8">
              <button 
                className="w-full text-left"
                onClick={() => setShowReferences(!showReferences)}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                  <span>References ({article.references.length})</span>
                  <span className="text-2xl">{showReferences ? '−' : '+'}</span>
                </h3>
              </button>
              
              {showReferences && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-800/30 rounded-xl p-6 space-y-4"
                >
                  {article.references.map((ref, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <a 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-white hover:text-primary-300 transition-colors flex items-center gap-2"
                        >
                          {ref.title || ref.url}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {ref.description && (
                          <p className="text-gray-400 mt-2">{ref.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Related Information */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">About This Article</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Source Information</h4>
              <div className="space-y-2 text-gray-400">
                <p>This article was {article.is_updated ? 'AI-enhanced' : 'scraped'} from:</p>
                {article.slug && (
                  <a 
                    href={article.slug} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 break-all"
                  >
                    {article.slug}
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Article Type</h4>
              <div className="space-y-2 text-gray-400">
                <p>
                  {article.is_updated 
                    ? 'This is an AI-enhanced version created in Phase 2, with improved formatting and content based on Google search references.'
                    : 'This is the original article scraped from BeyondChats in Phase 1.'
                  }
                </p>
                {article.is_updated && article.original_article_id && (
                  <p className="text-sm">
                    <Link 
                      to={`/article/${article.original_article_id}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      View original version
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;