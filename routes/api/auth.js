const router = require('express').Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
require('dotenv').config({ path: './config/config.env' });

// @route GET api/auth
// @desc Authenticate User
// @access PRIVATE
router.get('/', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password');

    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc LOGIN User and get token
// @access PUBLIC
router.post(
  '/',
  [
    body('email', 'Email is required')
      .isEmail()
      .customSanitizer((value) => {
        return value.toLowerCase();
      }),
    body('password', 'Password is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect email or password' }] });
      }

      const isMatch = await bcrpyt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect email or password' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '14d' },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
