import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/auth.js";

// Register user
export const register = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar is required" });
    }

 

    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Avatar from Cloudinary - CORRECTED
    const avatar = {
      public_id: req.file.filename, // multer-storage-cloudinary stores the public_id in filename
      url: req.file.path,           // This contains the full Cloudinary URL
    };


    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await user.save();
    generateToken(user._id, res);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // ensure password is fetched
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), 
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", 
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(" Logout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password" 
    );

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(" Get other users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchProfile = async (req, res) => {
  try {
    // req.user._id comes from your auth middleware (JWT verified user)
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (req.file) {
      user.avatar = {
        public_id: req.file.filename, // Assumes multer-storage-cloudinary
        url: req.file.path,
      };
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


