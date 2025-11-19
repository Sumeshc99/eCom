import { Router } from "express";
import {
  signIn,
  signInWithPhone,
  signUp,
  verifyOtp,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in using email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /auth/phone-signin:
 *   post:
 *     summary: Send OTP for phone login or registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP generated successfully"
 *               isNewUser: false
 *               phone: "9876543210"
 *               otp: 123456
 *       400:
 *         description: Phone number is required
 *       500:
 *         description: Server error
 */
router.post("/phone-signin", signInWithPhone);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for phone authentication
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP verified successfully"
 *               token: "jwt_token_here"
 *               data:
 *                 id: "65abcf1234df55aa1299ee77"
 *                 phone: "9876543210"
 *                 role: "user"
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOtp);

export default router;
