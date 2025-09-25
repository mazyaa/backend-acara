import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import * as authController from "../controllers/authContoller";
import * as mediaMiddleware from "../middlewares/mediaMiddleware";
import * as mediaController from "../controllers/mediaController";
import * as CategoryController from "../controllers/categoryController";
import * as regionController from "../controllers/regionController";
import * as eventController from "../controllers/eventController";
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
  /*
  #swagger.tags = ['Category]
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true, 
    schema: {
      $ref: "#/components/schemas/CreateCategoryRequest"
    }
  }
  */
);
router.get("/category", CategoryController.findAll
  /*
  #swagger.tags = ['Category']
  */
);
router.get("/category/:id", CategoryController.findOne
  /*
  #swagger.tags = ['Category']
  */
);
router.put(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  CategoryController.update
  /*
  #swagger.tags = ['Category]
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
      required: true, 
      schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
    }
  }
  */
);
router.delete(
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  CategoryController.remove
  /*
  #swagger.tags = ['Category']
  #swagger.security = [{ "bearerAuth": {} }]
  */
);

//region routes
router.get("/regions", regionController.getAllProvinces);
router.get("/region/:id/province", regionController.getProvince); // get regency by id province
router.get("/region/:id/regency", regionController.getRegency); // get district by id regency
router.get("/region/:id/district", regionController.getDistrict); // get village by id district
router.get("/region/:id/village", regionController.getVillage); // find one village by id
router.get("/region-search", regionController.findByCity); // search by city name

//event routes
router.post(
  "/event",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
  /*
  #swagger.tags = ['Events]
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateEventRequest"
    }
  }
  */
);
router.get("/events", eventController.findAll
  /*
  #swagger.tags = ['Events']
  */
);
router.get("/event/:id", eventController.findOne
  /*
  #swagger.tags = ['Events']
  */
);
router.put(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
  /*
  #swagger.tags = ['Events]
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateEventRequest"
    }
  }
  */
);
router.delete(
  "/event/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
  /*
  #swagger.tags = ['Events]
  #swagger.security = [{ "bearerAuth": {} }]
  */
);
router.get("/event/:slug/slug", eventController.findOneBySlug
  /*
  #swagger.tags = ['Events']
  */
);

// media routes
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
