import express from "express";
import {
  allUsers,
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile); //req.file comes from multer
router.route("/suggested").get(isAuthenticated, getSuggestUsers);
router.route("/followorunfollow/:id").get(isAuthenticated, followOrUnfollow);
router.route("/").get(isAuthenticated, allUsers);

export default router;
