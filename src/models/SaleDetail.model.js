import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Sale from "./Sale.model.js";
import Product from "./Product.model.js";

class SaleDetail extends Model {}

SaleDetail.init(
    {
        saleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Sale,
                key: "id",
            },
            validate: {
                notNull: {
                    msg: "El ID de la venta es obligatorio",
                },
                isInt: {
                    msg: "El ID de la venta debe ser un número entero válido",
                },
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            references: {
                model: Product,
                key: "id",
            },
        },
        productName: {
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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "La cantidad no acepta valores nulos",
                },
                isInt: {
                    msg: "La cantidad debe ser un número entero",
                },
                min: {
                    args: [1],
                    msg: "La cantidad debe ser mayor a 0",
                },
            },
        },
        price: {
            type: DataTypes.DECIMAL(13, 2),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "El precio unitario no acepta valores nulos",
                },
                isDecimal: {
                    msg: "El precio unitario debe ser un número decimal válido",
                },
                min: {
                    args: [0],
                    msg: "El precio unitario no puede ser negativo",
                },
            },
        },
        subtotal: {
            type: DataTypes.DECIMAL(13, 2),
            allowNull:false,
            validate: {
                notNull: {
                    msg: "El subtotal no acepta valores nulos",
                },
                isDecimal: {
                    msg: "El subtotal debe ser un número decimal válido",
                },
                min: {
                    args: [0],
                    msg: "El subtotal no puede ser negativo",
                },
            },
        },
    },
    {
        sequelize,
        modelName: "saleDetail",
        tableName: "SaleDetails",
        timestamps: false,
        underscored: true,
    },
);

export default SaleDetail;