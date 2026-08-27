const express = require('express');
const router = express.Router();
const {
  getForumPosts,
  getForumPostById,
  createForumPost,
  addReply,
  toggleUpvote,
  markResolved,
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getForumPosts).post(protect, createForumPost);
router.route('/:id').get(getForumPostById);
router.post('/:id/reply', protect, addReply);
router.put('/:id/upvote', protect, toggleUpvote);
router.put('/:id/resolve', protect, markResolved);

module.exports = router;
