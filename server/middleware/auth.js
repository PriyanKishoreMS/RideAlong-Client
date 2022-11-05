const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization denied'});
  }

  // Verify token
  try {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({msg: 'Token is not valid'});
        console.log(err);
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({msg: 'Server Error'});
  }
};
