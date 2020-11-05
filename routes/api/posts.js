const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create post
// @access  PRIVATE
router.post(
  '/',
  [auth, body('text', 'Please enter a text').not().isEmpty().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  PRIVATE
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  PRIVATE
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  PRIVATE
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.deleteOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (post.deletedCount == 0) {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.json({ msg: 'Post deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like post
// @access  PRIVATE
router.put('/:id/like', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    const isLiked = post.likes.find((like) => like.user == req.user.id);

    if (isLiked) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'You already liked this' }] });
    }

    post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: { $each: [{ user: req.user.id }], $position: 0 } } },
      { new: true }
    );

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like post
// @access  PRIVATE
router.put('/:id/unlike', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    const isLiked = post.likes.find((like) => like.user == req.user.id);

    if (!isLiked) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You already don't liked this" }] });
    }

    post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: { user: req.user.id } } },
      { new: true }
    );

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/comments
// @desc    Create comment
// @access  PRIVATE
router.post(
  '/:id/comments',
  [auth, body('text', 'Please enter a comment').not().isEmpty().trim()],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar
      };

      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: { $each: [newComment] } } },
        { new: true }
      );

      if (!post) {
        return res.status(400).json({ errors: [{ msg: 'No post found' }] });
      }

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      if (error.kind == 'ObjectId') {
        return res.status(400).json({ errors: [{ msg: 'No post found' }] });
      }

      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/posts/:id/comment/:cid
// @desc    Delete comment
// @access  PRIVATE
router.delete('/:id/comments/:cid', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { comments: { _id: req.params.cid, user: req.user.id } } },
      { new: true }
    );

    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'No comment found' }] });
    }

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No post found' }] });
    }

    res.status(500).send('Server error');
  }
});

module.exports = router;
