import Category from "../models/Category.model.js";

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        res.json({
            status: "success",
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener las categorias",
            error: error.message
        });
    }
};

// GET  CATEGORY BY ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                status: "fail",
                message: `No se encontró ninguna categoría con el id ${id}`
            });
        }

        res.status(200).json({
            status: "success",
            category
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener la categoría",
            error: error.message
        });
    }
};

// CREATE NEW CATEGORY
export const createCategory = async (req, res) => {
    try {

        const category = await Category.create(req.body);

        res.status(201).json({
            status: "success",
            message: "Categoría creada exitosamente.",
            category
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err) => err.message);
            return res.status(400).json({
                status: "fail",
                errors
            });
        }

        res.status(500).json({
            status: "error",
            message: "Error al crear la categoría",
            error: error.message
        });
    }
};