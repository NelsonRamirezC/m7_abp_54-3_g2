import express from "express";
import * as salesController from "../controllers/sales.controller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//OBTENER TODAS LAS VENTAS

router.get("/", salesController.getAllSales);

//OBTENER VENTAS POR ID
router.get("/:id", salesController.getSaleById);

router.post("/", validateBody, salesController.createSale);

export default router;