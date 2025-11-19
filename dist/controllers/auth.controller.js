"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.signInWithPhone = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
// ==================== SIGN UP ====================
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await user_model_1.default.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signUp = signUp;
// ==================== SIGN IN ====================
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password || "");
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signIn = signIn;
// ==================== SIGN IN WITH PHONE ====================
const signInWithPhone = async (req, res) => {
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
        await otp_model_1.default.deleteMany({ phone });
        // 3️⃣ Save new OTP in OTP Table
        await otp_model_1.default.create({
            phone,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });
        // 4️⃣ Find or create user (no OTP saved here)
        let user = await user_model_1.default.findOne({ phone });
        let isNewUser = false;
        if (!user) {
            user = await user_model_1.default.create({ phone, role: "user" });
            isNewUser = true;
        }
        return res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            isNewUser,
            phone,
            otp, // Dev only
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signInWithPhone = signInWithPhone;
// ==================== VERIFY OTP ====================
const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const otpEntry = await otp_model_1.default.findOne({ phone });
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
        await otp_model_1.default.deleteMany({ phone });
        // 2️⃣ Find user
        const user = await user_model_1.default.findOne({ phone });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        // 3️⃣ Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.verifyOtp = verifyOtp;
