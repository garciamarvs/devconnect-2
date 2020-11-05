const router = require('express').Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const axios = require('axios');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const e = require('express');

// @route   GET api/profile/me
// @desc    Get current profile
// @access  PRIVATE
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile.populate('user', ['name', 'avatar']);
    } else {
      return res.status(400).json({ errors: [{ msg: 'No profile found' }] });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/profile
// @desc    Create/Update profile
// @access  PRIVATE
router.post(
  '/',
  [
    auth,
    body('status', 'Please enter a status').not().isEmpty().trim(),
    body('skills', 'Please enter a skills').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    const profileFields = {
      user: req.user.id,
      company,
      website:
        website && website.length > 0
          ? normalize(website, { forceHttps: true })
          : '',
      location,
      status,
      skills: skills.split(',').map((skill) => skill.trim()),
      bio,
      githubusername
    };

    const socialFields = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = normalize(value, { forceHttps: true });
      }
    }

    profileFields.social = socialFields;

    try {
      let profile = await Profile.findOneAndUpdate(
        {
          user: req.user.id
        },
        { $set: profileFields },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/profile
// @desc    Get all profile
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profile/user/:id
// @desc    Get user profile by id
// @access  PUBLIC
router.get('/user/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'No profile found' }] });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No profile found' }] });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/profile
// @desc    Delete user profile
// @access  PRIVATE
router.delete('/', auth, async (req, res) => {
  try {
    // Delete posts
    await Post.deleteMany({ user: req.user.id });

    // Delete profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No profile found' }] });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add experience
// @access  PRIVATE
router.put(
  '/experience',
  [
    auth,
    body('title', 'Please enter your title').not().isEmpty().trim(),
    body('company', 'Please enter your company').not().isEmpty().trim(),
    body('from', 'Please enter a valid from date')
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value > (req.body.to !== '')) {
          return false;
        }

        return true;
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $push: { experience: { $each: [newExperience], $position: 0 } } },
        { new: true }
      );

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/profile/experience/:id
// @desc    Delete experience
// @access  PRIVATE
router.put('/experience/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { experience: { _id: req.params.id } } },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No experience found' }] });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/education
// @desc    Create education
// @access  PRIVATE
router.put(
  '/education',
  [
    auth,
    body('school', 'Please enter a school').not().isEmpty().trim(),
    body('degree', 'Please enter a degree').not().isEmpty().trim(),
    body('from', 'Please enter a valid from date')
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value > (req.body.to !== '')) {
          return false;
        }

        return true;
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $push: { education: { $each: [newEducation], $position: 0 } } },
        { new: true }
      );

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/profile/education/:id
// @desc    Delete education
// @access  PRIVATE
router.put('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { education: { _id: req.params.id } } },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'No experience found' }] });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/profile/github/:username
// @desc    Get github repos
// @access  PUBLIC
router.get('/github/:username', async (req, res) => {
  try {
    const url = `https://api.github.com/users/${req.params.username}/repos?sort=created:desc&per_page=5`;

    const repos = await axios.get(url);

    if (repos.status !== 200) {
      return res.status(400).json({ msg: 'No Github Repos Found' });
    }

    res.json(repos.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
