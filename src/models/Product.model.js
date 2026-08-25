import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Category.model.js";

class Product extends Model {}

Product.init(
    {
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "El nombre no acepta valores nulos",
                },
                notEmpty: {
                    msg: "El nombre no puede estar vacío",
                },
                len: {
                    args: [1, 150],
                    msg: "El nombre debe tener entre 1 y 150 caracteres",
                },
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(13, 2),
            allowNull: false,
            defaultValue: 99999999999.99,
            validate: {
                notNull: {
                    msg: "El precio no acepta valores nulos",
                },
                isDecimal: {
                    msg: "El precio debe ser un número decimal válido",
                },
                min: {
                    args: [0],
                    msg: "El precio no puede ser negativo",
                },
            },
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                notNull: {
                    msg: "El stock no acepta valores nulos",
                },
                isInt: {
                    msg: "El stock debe ser un número entero",
                },
                min: {
                    args: [0],
                    msg: "El stock no puede ser negativo",
                },
            },
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: Category,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "product",
        tableName: "Products",
        timestamps: true,
        underscored: true,
    },
);

export default Product;
