const ForumPost = require('../models/ForumPost');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getForumPosts = async (req, res) => {
  try {
    let query = {};

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.crop && req.query.crop !== 'All') {
      query.cropTag = { $regex: new RegExp(req.query.crop, 'i') };
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { cropTag: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name role avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single forum post by ID
// @route   GET /api/forum/:id
// @access  Public
const getForumPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role avatar location')
      .populate('replies.user', 'name role avatar');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new question/post
// @route   POST /api/forum
// @access  Private
const createForumPost = async (req, res) => {
  try {
    const { title, category, cropTag, description, imageUrl } = req.body;

    const post = await ForumPost.create({
      author: req.user._id,
      authorName: req.user.name,
      title,
      category: category || 'Crop Diseases',
      cropTag: cropTag || 'General',
      description,
      imageUrl: imageUrl || '',
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Question posted to community forum',
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add reply to post (Farmer or Expert)
// @route   POST /api/forum/:id/reply
// @access  Private
const addReply = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { content } = req.body;
    const isExpert = req.user.role === 'expert' || req.user.role === 'admin';

    post.replies.push({
      user: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
      isExpertAnswer: isExpert,
      upvotes: 0,
      createdAt: new Date(),
    });

    if (isExpert && post.status === 'Open') {
      post.status = 'Expert Answered';
    }

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Reply submitted',
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle upvote on post
// @route   PUT /api/forum/:id/upvote
// @access  Private
const toggleUpvote = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyUpvoted = post.upvotedBy.some((id) => id.toString() === userIdStr);

    if (alreadyUpvoted) {
      post.upvotedBy = post.upvotedBy.filter((id) => id.toString() !== userIdStr);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      post.upvotedBy.push(req.user._id);
      post.upvotes += 1;
    }

    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes,
      isUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark post as resolved
// @route   PUT /api/forum/:id/resolve
// @access  Private
const markResolved = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.status = 'Resolved';
    await post.save();

    res.json({
      success: true,
      message: 'Discussion marked as resolved',
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getForumPosts,
  getForumPostById,
  createForumPost,
  addReply,
  toggleUpvote,
  markResolved,
};
