import express from "express";

const router = express.Router();

router.get("/", (req, res) =>
    res.render("dashboard", { title: "Resumen", active: "dashboard" }),
);
router.get("/usuarios", (req, res) =>
    res.render("users", { title: "Usuarios", active: "users" }),
);
router.get("/productos", (req, res) =>
    res.render("products", { title: "Productos", active: "products" }),
);
router.get("/categorias", (req, res) =>
    res.render("categories", { title: "Categorías", active: "categories" }),
);
router.get("/ventas", (req, res) =>
    res.render("sales", { title: "Ventas", active: "sales" }),
);
router.get("/perfiles", (req, res) =>
    res.render("profiles", { title: "Perfiles", active: "profiles" }),
);

export default router;
