import User from "../../model/userModel.js";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../../services/emailServices.js";

const verificationCodes = {};

export class AuthController {
  // Send verification code
  static sendVerification = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Check if email exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Generate code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store code
      verificationCodes[email] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      // Send email
      const emailResponse = await sendVerificationEmail(email, code);

      if (emailResponse.success) {
        res.json({
          success: true,
          message: "Verification code sent",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send email",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error sending verification",
        error: error.message,
      });
    }
  };

  // Register user
  static register = async (req, res) => {
    try {
      const { username, email, password, displayName, verificationCode } =
        req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Verify code
      const storedCode = verificationCodes[email];
      if (!storedCode) {
        return res.status(400).json({
          success: false,
          message: "No verification code found",
        });
      }

      if (storedCode.code !== verificationCode) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code",
        });
      }

      if (Date.now() > storedCode.expiresAt) {
        delete verificationCodes[email];
        return res.status(400).json({
          success: false,
          message: "Verification code expired",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profile: {
          displayName: displayName || username,
          avatar: "👤",
        },
      });

      // Clean up code
      delete verificationCodes[email];

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  };

  // Login user
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  };

  // Get user profile
  static getProfile = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get profile",
        error: error.message,
      });
    }
  };

  // Get all users
  static getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };

  // Update profile
  static updateProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const { displayName, bio, location, avatar } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update data
      const updateData = {};
      if (displayName !== undefined)
        updateData["profile.displayName"] = displayName;
      if (bio !== undefined) updateData["profile.bio"] = bio;
      if (location !== undefined) updateData["profile.location"] = location;
      if (avatar !== undefined) updateData["profile.avatar"] = avatar;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Profile update failed",
        error: error.message,
      });
    }
  };
}
