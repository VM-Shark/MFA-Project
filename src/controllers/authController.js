import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import constants from "../config/constants.js";
import asyncHandler from "express-async-handler";

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    isMfaActive: false,
  });
  console.log("New User : ", newUser);
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

const login = asyncHandler(async (req, res) => {
  console.log("The authenticated user is : ", req.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
});

const authStatus = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    return next({
      statusCode: constants.UNAUTHORIZED,
      message: "Unauthorized user",
    });
  }
});

const logout = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next({
      statusCode: constants.UNAUTHORIZED,
      message: "Unauthorized user",
    });
  }

  req.logout((err) => {
    if (err) {
      return next({
        statusCode: constants.SERVER_ERROR,
        message: "Error logging out",
      });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
});

const setup2FA = asyncHandler(async (req, res) => {
  console.log("The req.user is : ", req.user);
  let user = req.user;

  // If req.user is not fully populated (e.g., it's just an ID), fetch the user
  if (typeof user !== "object" || !user.username) {
    user = await User.findById(req.user);
  }

  const secret = speakeasy.generateSecret();
  console.log("The secret object is : ", secret);

  user.twoFactorSecret = secret.base32;
  user.isMfaActive = true;
  await user.save();

  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${user.username}`,
    issuer: "www.dipeshmalvia.com",
    encoding: "base32",
  });

  const qrImageUrl = await qrCode.toDataURL(url);
  res.status(200).json({ qrCode: qrImageUrl });
});

const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    const jwtToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res.status(200).json({ message: "2FA successful", token: jwtToken });
  } else {
    return next({
      statusCode: constants.VALIDATION_ERROR,
      message: "Invalid 2FA token",
    });
  }
});

const reset2FA = asyncHandler(async (req, res) => {
  const user = req.user;
  user.twoFactorSecret = "";
  user.isMfaActive = false;
  await user.save();
  res.status(200).json({ message: "2FA reset successful" });
});

export { register, login, authStatus, logout, setup2FA, verify2FA, reset2FA };
