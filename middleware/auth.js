const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/config.env' });

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'No token' }] });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).send('Invalid token');
  }
};
