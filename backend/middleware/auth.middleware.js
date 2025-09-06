import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      // Get client IP address
      const clientIP =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user is suspended and suspension period is still active
      if (req.user.isSuspended && req.user.suspensionEndDate > Date.now()) {
        const remainingTime = Math.ceil(
          (req.user.suspensionEndDate - Date.now()) / (1000 * 60 * 60)
        );
        return res.status(403).json({
          message: `Your account is suspended: ${
            req.user.suspensionReason || 'Violation of community guidelines'
          }. Suspension ends in approximately ${remainingTime} hours.`,
        });
      } else if (
        req.user.isSuspended &&
        req.user.suspensionEndDate <= Date.now()
      ) {
        // If suspension period has ended, remove suspension
        await User.findByIdAndUpdate(req.user._id, {
          isSuspended: false,
          suspensionEndDate: null,
          suspensionReason: null,
        });
      }

      // Check if user's IP is restricted
      const isIPRestricted =
        req.user.restrictedIPs &&
        req.user.restrictedIPs.some((item) => item.ip === clientIP);

      if (isIPRestricted) {
        return res.status(403).json({
          message:
            'Access from your current location is restricted. Please contact support.',
        });
      }

      // Update user's IP if it's different from the last login
      if (req.user.lastLoginIP !== clientIP) {
        await User.findByIdAndUpdate(req.user._id, {
          lastLoginIP: clientIP,
          $push: { ipHistory: { ip: clientIP, timestamp: new Date() } },
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
