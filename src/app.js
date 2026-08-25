import express from "express";
import { engine } from "express-handlebars";
import path from "node:path";
import { fileURLToPath } from "node:url";
import usersRoutes from "./routes/users.routes.js";
import profilesRoutes from "./routes/profiles.routes.js";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import webRoutes from "./routes/web.routes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(
    "handlebars",
    engine({
        defaultLayout: "main",
        helpers: { eq: (left, right) => left === right },
    }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//ENDPOINTS
app.use("/", webRoutes);
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
