import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import * as authController from "../controllers/authContoller";
import * as mediaMiddleware from "../middlewares/mediaMiddleware";
import * as mediaController from "../controllers/mediaController";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/activation", authController.activation);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

router.post(
  "/media/upload-single",
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.single("file"),
  ],
  mediaController.single
);

router.post(
  "/media/upload-multiple",
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple("files"),
  ],
  mediaController.multiple
);

router.delete("/media/remove", [
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove);

export default router;
