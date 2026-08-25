import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Category extends Model {}

Category.init(
    {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique:true,
            validate: {
                notNull: {
                    msg: "El nombre de categoría no acepta valores nulos"
                },
                notEmpty: {
                    msg: "EEl nombre de categoría  no puede estar vacío"
                },
                len: {
                    args: [3, 100],
                    msg: "El nombre de categoría  está fuera de rango: [3-50]"
                }
            }
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "category", // We need to choose the model name
        tableName: "Categories",
        timestamps: false,
        underscored: true
    },
);

export default Category;