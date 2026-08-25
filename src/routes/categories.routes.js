import express from "express";
import * as categoriesController from "../controllers/categories.controller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", categoriesController.getAllCategories);

// GET CATEGORY BY ID
router.get("/:id", categoriesController.getCategoryById);

// CREATE NEW CATEGORY
router.post("/", validateBody, categoriesController.createCategory);

// UPDATE CATEGORY
//router.put("/:id", validateBody, categoriesController.updateCategory);

// DELETE CATEGORY
//router.delete("/:id", categoriesController.deleteCategoryById);

export default router;
