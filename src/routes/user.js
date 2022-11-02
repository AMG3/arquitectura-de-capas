import * as dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import passport from "passport";

import { upload } from "../middlewares/upload.js";
import { isLoggedIn, notLoggedIn } from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", isLoggedIn, userController.getProfile);
router.get("/logout", isLoggedIn, userController.handleLogout);
router.use("/", notLoggedIn, userController.handleDefault);
router.get("/signup", userController.renderSignUp);
router.post(
  "/signup",
  upload.single("user_photo"),
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  userController.handleSignUp
);
router.get("/signin", userController.renderSignIn);
router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  userController.handleSignIn
);

export default router;
