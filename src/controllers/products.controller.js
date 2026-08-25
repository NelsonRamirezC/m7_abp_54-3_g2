import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {

        const products = await Product.findAll({
            attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] },
            include: [
                {
                    model: Category,
                }
            ]
        });

        res.json({
            status: "success",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener los productos",
            error: error.message,
        });
    }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: `No se encontró ningún producto con el id ${id}`,
            });
        }

        res.status(200).json({
            status: "success",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener el producto",
            error: error.message,
        });
    }
};

// CREATE NEW PRODUCT
export const createProduct = async (req, res) => {
    try {

        let product = await Product.create(req.body);

        res.status(201).json({
            status: "success",
            message: "Producto creado exitosamente",
            product,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err) => err.message);
            return res.status(400).json({
                status: "fail",
                errors,
            });
        }

        res.status(500).json({
            status: "error",
            message: "Error al crear el producto",
            error: error.message,
        });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: `No se encontró ningún producto con el id ${id}`,
            });
        }

        await product.update({
            name,
            description,
            price,
            stock,
        });

        res.status(200).json({
            status: "success",
            message: "Producto actualizado exitosamente",
            data: product,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err) => err.message);
            return res.status(400).json({
                status: "fail",
                errors,
            });
        }

        res.status(500).json({
            status: "error",
            message: "Error al actualizar el producto",
            error: error.message,
        });
    }
};

// DELETE PRODUCT BY ID
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: `No se encontró ningún producto con el id ${id}`,
            });
        }

        await product.destroy();

        res.status(200).json({
            status: "success",
            message: `Producto ${product.name}, eliminado exitosamente.`,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al eliminar el producto",
            error: error.message,
        });
    }
};
