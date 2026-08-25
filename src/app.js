import express from "express";
import usersRoutes from "./routes/users.routes.js";
import profilesRoutes from "./routes/profiles.routes.js";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import salesRoutes from "./routes/sales.routes.js";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ENDPOINTS
app.use("/api/users", usersRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/sales", salesRoutes);

//RUTA 404
app.all("*path", (req, res) => {
    res.status(404).json({ message: "Ruta no encontrada." });
});

export default app;
