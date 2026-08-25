import express from "express";
import * as usersController from "../controllers/users.controller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//GET ALL USERS
router.get("/", usersController.getAllUsers);

//GET USER BY ID
router.get("/:id", usersController.getUserById);

//CREATE NEW USERS
router.post("/", validateBody, usersController.createUser);

//UPDATE USERS
router.put("/:id", validateBody, usersController.updateUser);

//DELETE USERS
router.delete("/:id", usersController.deleteUserById);


export default router;