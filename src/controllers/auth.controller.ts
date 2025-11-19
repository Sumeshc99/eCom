import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import OtpModel from "../models/otp.model";

// ==================== SIGN UP ====================
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== SIGN IN ====================
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== SIGN IN WITH PHONE ====================
export const signInWithPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // 1️⃣ Generate Dummy OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 2️⃣ Always delete old OTP for same phone
    await OtpModel.deleteMany({ phone });

    // 3️⃣ Save new OTP in OTP Table
    await OtpModel.create({
      phone,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // 4️⃣ Find or create user (no OTP saved here)
    let user = await UserModel.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      user = await UserModel.create({ phone, role: "user" });
      isNewUser = true;
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      isNewUser,
      phone,
      otp, // Dev only
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== VERIFY OTP ====================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const otpEntry = await OtpModel.findOne({ phone });

    if (!otpEntry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found, please request new one",
      });
    }

    if (otpEntry.otp !== Number(otp) || otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // 1️⃣ OTP matched — delete OTP entry
    await OtpModel.deleteMany({ phone });

    // 2️⃣ Find user
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Create JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      data: {
        id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
