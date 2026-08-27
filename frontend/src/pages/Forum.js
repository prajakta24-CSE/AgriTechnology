import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const FORUM_CATEGORIES = ['All', 'Crop Diseases', 'Soil & Fertilizers', 'Pest Control', 'Irrigation Tech', 'Market Trends', 'Government Schemes'];

const Forum = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal & Reply states
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newPostData, setNewPostData] = useState({
    title: '',
    category: 'Crop Diseases',
    cropTag: 'Cotton',
    description: '',
  });

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = '/forum?';
      if (activeCategory !== 'All') url += `category=${encodeURIComponent(activeCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to post questions.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/forum', newPostData);
      if (res.data.success) {
        setShowAskModal(false);
        setNewPostData({
          title: '',
          category: 'Crop Diseases',
          cropTag: 'Cotton',
          description: '',
        });
        setToastMsg('Question posted to agricultural community! 🌾');
        fetchPosts();
        setTimeout(() => setToastMsg(''), 3500);
      }
    } catch (err) {
      alert('Error posting question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (postId) => {
    if (!replyContent.trim()) return;
    if (!isAuthenticated) {
      alert('Please sign in to answer questions');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/forum/${postId}/reply`, {
        content: replyContent,
      });
      if (res.data.success) {
        setReplyContent('');
        setSelectedPost(null);
        setToastMsg('Reply submitted successfully!');
        fetchPosts();
        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch (err) {
      alert('Error submitting reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUpvote = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to upvote');
      return;
    }
    try {
      await api.put(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch (err) {
      console.error('Upvote error');
    }
  };

  const handleResolve = async (postId) => {
    try {
      await api.put(`/forum/${postId}/resolve`);
      setToastMsg('Marked discussion as resolved!');
      fetchPosts();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Error marking resolved');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('forum.title', 'Expert Consultation & Farmers Community')}</h2>
          <p className="text-muted small mb-0">
            {t('forum.subtitle', 'Connect with verified agricultural scientists and peer farmers for crop solutions.')}
          </p>
        </div>
        <button className="btn btn-agri shadow-sm" onClick={() => setShowAskModal(true)}>
          <i className="bi bi-chat-dots-fill me-2"></i> {t('forum.askQuestion', 'Ask an Agricultural Expert')}
        </button>
      </div>

      {toastMsg && (
        <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="agri-card p-3 mb-4 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); fetchPosts(); }} className="input-group mb-3">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder={t('forum.searchTopics', 'Search questions, crop diseases, or remedies...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-agri-outline" type="submit">
            Search
          </button>
        </form>

        <div className="d-flex gap-2 flex-wrap">
          {FORUM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                activeCategory === cat ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <i className="bi bi-chat-square-text text-muted fs-1 mb-3 d-block"></i>
          <h5 className="fw-bold">No Discussion Threads Found</h5>
          <p className="text-muted small">Be the first to post a question or crop symptom for expert review!</p>
          <button className="btn btn-agri" onClick={() => setShowAskModal(true)}>
            Ask First Question
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <div key={post._id} className="agri-card p-4 bg-white border">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                    {post.category}
                  </span>
                  <span className="badge bg-secondary font-monospace">{post.cropTag}</span>
                  {post.status === 'Expert Answered' && (
                    <span className="badge bg-primary text-white">
                      <i className="bi bi-patch-check-fill me-1"></i> {t('forum.expertAnswer', 'Verified Expert Answer')}
                    </span>
                  )}
                  {post.status === 'Resolved' && (
                    <span className="badge bg-success text-white">
                      <i className="bi bi-check2-circle me-1"></i> Resolved
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                    onClick={() => handleToggleUpvote(post._id)}
                  >
                    <i className="bi bi-hand-thumbs-up"></i>
                    <span>{post.upvotes}</span>
                  </button>

                  {user && post.author?._id === user._id && post.status !== 'Resolved' && (
                    <button
                      className="btn btn-sm btn-outline-secondary py-1"
                      onClick={() => handleResolve(post._id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
              <p className="text-muted small mb-3">{post.description}</p>

              <div className="d-flex align-items-center gap-2 text-muted small pb-3 border-bottom">
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}
                >
                  {post.authorName?.[0] || 'F'}
                </div>
                <span>Asked by <strong>{post.authorName}</strong></span>
                <span>&bull;</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>&bull;</span>
                <span>{post.replies?.length || 0} Replies</span>
              </div>

              {/* Replies Thread */}
              {post.replies && post.replies.length > 0 && (
                <div className="mt-3 d-flex flex-column gap-2">
                  {post.replies.map((reply, rIdx) => (
                    <div
                      key={rIdx}
                      className={`p-3 rounded-3 border small ${
                        reply.isExpertAnswer ? 'bg-success bg-opacity-10 border-success' : 'bg-light'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <strong className="text-dark">{reply.authorName}</strong>
                          {reply.isExpertAnswer && (
                            <span className="badge bg-success text-white" style={{ fontSize: '0.65rem' }}>
                              <i className="bi bi-patch-check-fill me-1"></i> Agricultural Expert
                            </span>
                          )}
                        </div>
                        <small className="text-muted">{new Date(reply.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-0 text-dark">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form Trigger */}
              <div className="mt-3">
                {selectedPost === post._id ? (
                  <div className="p-3 bg-light rounded-3 border">
                    <label className="form-label small fw-semibold text-muted">Your Solution / Expert Answer</label>
                    <textarea
                      className="form-control mb-2 small"
                      rows="2"
                      placeholder="Write your diagnostic solution, recommended fertilizer, or dosage..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    ></textarea>
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedPost(null)}>
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm btn-agri"
                        onClick={() => handleReplySubmit(post._id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Post Reply'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-sm btn-agri-outline"
                    onClick={() => setSelectedPost(post._id)}
                  >
                    <i className="bi bi-reply-fill me-1"></i> Write a Response / Solution
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-chat-dots-fill me-2"></i> Ask an Agricultural Expert
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAskModal(false)}></button>
              </div>
              <form onSubmit={handleAskSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Question / Crop Issue Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Yellow patches on 30-day cotton leaves — how to treat?"
                        value={newPostData.title}
                        onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Target Crop Tag</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Cotton, Rice, Wheat"
                        value={newPostData.cropTag}
                        onChange={(e) => setNewPostData({ ...newPostData, cropTag: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Topic Category</label>
                      <select
                        className="form-select"
                        value={newPostData.category}
                        onChange={(e) => setNewPostData({ ...newPostData, category: e.target.value })}
                      >
                        <option value="Crop Diseases">Crop Diseases & Symptoms</option>
                        <option value="Soil & Fertilizers">Soil & Fertilizer Management</option>
                        <option value="Pest Control">Pest Control & Spraying</option>
                        <option value="Irrigation Tech">Irrigation Tech & Pumps</option>
                        <option value="Market Trends">Market Trends & Selling</option>
                        <option value="Government Schemes">Government Subsidies & Schemes</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Detailed Symptoms & Description</label>
                      <textarea
                        required
                        rows="4"
                        className="form-control"
                        placeholder="Describe leaf condition, moisture status, days since planting, and fertilizer applied..."
                        value={newPostData.description}
                        onChange={(e) => setNewPostData({ ...newPostData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAskModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Submit Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
