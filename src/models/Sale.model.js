import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.model.js";

class Sale extends Model {}

Sale.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: "La fecha de venta debe tener un formato de fecha válido",
                },
            },
        },
        total: {
            type: DataTypes.DECIMAL(13, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                notNull: {
                    msg: "El total no acepta valores nulos",
                },
                isDecimal: {
                    msg: "El total debe ser un número decimal válido",
                },
                min: {
                    args: [0],
                    msg: "El total no puede ser un valor negativo",
                },
            },
        },
    },
    {
        sequelize,
        modelName: "sale",
        tableName: "Sales",
        timestamps: false,
        underscored: true,
    },
);

export default Sale;