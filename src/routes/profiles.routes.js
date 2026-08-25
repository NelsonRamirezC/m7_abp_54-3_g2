import express from "express";
import * as profilesController from "../controllers/profiles.controller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//UPDATE USERNAME

router.get("/:id", profilesController.getProfileById);

//RUTA PARA VERIFICAR SI EXISTE EL USERNAME
router.get("/username/:username", profilesController.getExistUsername);

router.put("/:id", validateBody, profilesController.updateUsername);

export default router;