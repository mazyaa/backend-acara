import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import * as authController from "../controllers/authContoller";
import * as mediaMiddleware from "../middlewares/mediaMiddleware";
import * as mediaController from "../controllers/mediaController";
import * as CategoryController from "../controllers/categoryController";
const router = express.Router();

// auth routes
router.post("/auth/register", authController.register);
router.post("/auth/activation", authController.activation);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

// category routes
router.post(
  "/category",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  CategoryController.create
);
router.get("/category", CategoryController.findAll);
router.get("/category/:id", CategoryController.findOne);
router.put(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  CategoryController.update
);
router.delete(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  CategoryController.remove
);

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

router.delete(
  "/media/remove",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
  mediaController.remove
);

export default router;
