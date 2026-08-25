import express from "express";
import * as productsController from "../controllers/products.controller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", productsController.getAllProducts);

// GET PRODUCT BY ID
router.get("/:id", productsController.getProductById);

// CREATE NEW PRODUCT
router.post("/", validateBody, productsController.createProduct);

// UPDATE PRODUCT
router.put("/:id", validateBody, productsController.updateProduct);

// DELETE PRODUCT
router.delete("/:id", productsController.deleteProductById);

export default router;