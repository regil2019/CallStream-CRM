import { Router } from "express";
import { register, verify, login, getMe } from "../controllers/auth.controller";
import { authLimiter } from "../middlewares/rateLimit";
import { authenticate } from "../middlewares/auth";

const router = Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user (Manager), sends SMS code
// @access  Public
router.post("/register", authLimiter, register);

// @route   POST /api/v1/auth/verify
// @desc    Verify SMS code to activate account
// @access  Public
router.post("/verify", authLimiter, verify);

// @route   POST /api/v1/auth/login
// @desc    Login via email + password
// @access  Public
router.post("/login", authLimiter, login);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, getMe);

export default router;
