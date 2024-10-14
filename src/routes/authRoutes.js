import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  authStatus,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";
import errorHandler from "../../middleware/errorHandler.js";

const router = Router();

// Registration Route
router.post("/register", register);

// LoginRoute
router.post("/login", passport.authenticate("local"), login);

// Auth Status Route
router.get("/status", authStatus);

// Logout Route
router.post("/logout", logout);

// 2FA Setup
router.post("/2fa/setup", isAuthenticated, setup2FA);

// verify Route
router.post("/2fa/verify", isAuthenticated, verify2FA);

// Reset Route
router.post("/2fa/reset", isAuthenticated, reset2FA);

export default router;
