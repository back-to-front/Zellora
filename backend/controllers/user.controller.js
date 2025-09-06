import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if user is suspended
      if (user.isSuspended && user.suspensionEndDate > Date.now()) {
        const remainingTime = Math.ceil(
          (user.suspensionEndDate - Date.now()) / (1000 * 60 * 60)
        );
        return res.status(403).json({
          message: `Your account is suspended: ${
            user.suspensionReason || 'Violation of community guidelines'
          }. Suspension ends in approximately ${remainingTime} hours.`,
        });
      } else if (user.isSuspended && user.suspensionEndDate <= Date.now()) {
        // If suspension period has ended, remove suspension
        user.isSuspended = false;
        user.suspensionEndDate = null;
        user.suspensionReason = null;
        await user.save();
      }

      // Check if user's IP is restricted
      const isIPRestricted =
        user.restrictedIPs &&
        user.restrictedIPs.some((item) => item.ip === clientIP);

      if (isIPRestricted) {
        return res.status(403).json({
          message:
            'Access from your current location is restricted. Please contact support.',
        });
      }

      // Update user's IP history
      user.lastLoginIP = clientIP;
      user.ipHistory.push({ ip: clientIP, timestamp: new Date() });
      await user.save();

      res.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      // Check if user is trying to update password
      if (req.body.newPassword && req.body.currentPassword) {
        // Verify current password before allowing password change
        if (await user.matchPassword(req.body.currentPassword)) {
          user.password = req.body.newPassword;
        } else {
          return res.status(400).json({
            message: 'Current password is incorrect',
            field: 'currentPassword',
          });
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all questions created by the user
    await Question.deleteMany({ user: req.user._id });

    // Delete all answers created by the user
    await Answer.deleteMany({ user: req.user._id });

    // Delete the user
    await User.deleteOne({ _id: req.user._id });

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user by ID (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting their own account through this endpoint
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Admin cannot delete their own account through this endpoint',
      });
    }

    // Delete all questions created by the user
    await Question.deleteMany({ user: user._id });

    // Delete all answers created by the user
    await Answer.deleteMany({ user: user._id });

    // Delete the user
    await User.deleteOne({ _id: user._id });

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/users/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalQuestions = await Question.countDocuments({});
    const totalAnswers = await Answer.countDocuments({});
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = totalUsers - adminUsers;
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    // Get recent users
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalQuestions,
      totalAnswers,
      adminUsers,
      regularUsers,
      suspendedUsers,
      recentUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Suspend a user (admin only)
// @route   PUT /api/users/:id/suspend
// @access  Private/Admin
export const suspendUser = async (req, res) => {
  try {
    const { reason, duration } = req.body;

    if (!duration || isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        message: 'Please provide a valid suspension duration in hours',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admins from suspending other admins or themselves
    if (user.isAdmin) {
      return res
        .status(400)
        .json({ message: 'Admin users cannot be suspended' });
    }

    // Calculate suspension end date
    const suspensionEndDate = new Date();
    suspensionEndDate.setHours(
      suspensionEndDate.getHours() + parseInt(duration)
    );

    user.isSuspended = true;
    user.suspensionEndDate = suspensionEndDate;
    user.suspensionReason = reason || 'Violation of community guidelines';

    await user.save();

    res.json({
      message: `User ${user.username} has been suspended for ${duration} hours`,
      suspensionEndDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove suspension from a user (admin only)
// @route   PUT /api/users/:id/unsuspend
// @access  Private/Admin
export const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isSuspended) {
      return res.status(400).json({ message: 'User is not suspended' });
    }

    user.isSuspended = false;
    user.suspensionEndDate = null;
    user.suspensionReason = null;

    await user.save();

    res.json({ message: `Suspension removed for user ${user.username}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Restrict IP for a user (admin only)
// @route   PUT /api/users/:id/restrict-ip
// @access  Private/Admin
export const restrictUserIP = async (req, res) => {
  try {
    const { ip, reason } = req.body;

    if (!ip) {
      return res.status(400).json({ message: 'Please provide an IP address' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admins from restricting IPs for other admins
    if (user.isAdmin) {
      return res
        .status(400)
        .json({ message: 'Cannot restrict IP for admin users' });
    }

    // Check if IP is already restricted
    const ipAlreadyRestricted =
      user.restrictedIPs && user.restrictedIPs.some((item) => item.ip === ip);

    if (ipAlreadyRestricted) {
      return res
        .status(400)
        .json({ message: 'This IP is already restricted for this user' });
    }

    // Add IP to restricted list
    if (!user.restrictedIPs) {
      user.restrictedIPs = [];
    }

    user.restrictedIPs.push({
      ip,
      reason: reason || 'Suspicious activity',
      restrictedAt: new Date(),
    });

    await user.save();

    res.json({
      message: `IP address ${ip} has been restricted for user ${user.username}`,
      restrictedIPs: user.restrictedIPs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove IP restriction for a user (admin only)
// @route   PUT /api/users/:id/unrestrict-ip
// @access  Private/Admin
export const removeIPRestriction = async (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ message: 'Please provide an IP address' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has any restricted IPs
    if (!user.restrictedIPs || user.restrictedIPs.length === 0) {
      return res.status(400).json({ message: 'User has no IP restrictions' });
    }

    // Check if the IP is in the restricted list
    const ipIndex = user.restrictedIPs.findIndex((item) => item.ip === ip);

    if (ipIndex === -1) {
      return res
        .status(400)
        .json({ message: 'This IP is not restricted for this user' });
    }

    // Remove IP from restricted list
    user.restrictedIPs.splice(ipIndex, 1);
    await user.save();

    res.json({
      message: `IP restriction for ${ip} has been removed for user ${user.username}`,
      restrictedIPs: user.restrictedIPs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
