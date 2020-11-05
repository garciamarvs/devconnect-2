const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
require('dotenv').config({ path: './config/config.env' });

// @route   POST api/users
// @desc    CREATE User and get token
// @access  PUBLIC
router.post(
  '/',
  [
    body('name', 'Please enter a name').not().isEmpty().trim(),
    body('email', 'Please enter a valid email')
      .isEmail()
      .customSanitizer((value) => {
        if (value) return value.toLowerCase();
      }),
    body(
      'password',
      'Please enter a password with atleast 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // Create Salt
      const salt = await bcrpyt.genSalt(10);
      // Hash password
      user.password = await bcrpyt.hash(password, salt);

      await user.save();

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
