import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import upload from "../config/multer.js";
import protectRoute from "../middleware/auth.js";
import { getOtherUsers } from "../controllers/user.controller.js";
import { fetchProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/other-users", protectRoute, getOtherUsers);
router.get("/profile", protectRoute, fetchProfile);
router.post("/update-profile", protectRoute, upload.single("avatar"), updateProfile);

export default router;
