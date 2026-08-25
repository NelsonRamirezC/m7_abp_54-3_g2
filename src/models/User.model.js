import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class User extends Model {}

User.init(
    {
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Nombre no acepta valores nulos"
                },
                notEmpty: {
                    msg: "Nombre no puede estar vacío"
                },
                len: {
                    args: [2, 50],
                    msg: "Nombre fuera de rango: [2-50]"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull:false,
            validate: {
                notNull: {
                    msg: "Apellido no acepta valores nulos"
                },
                notEmpty: {
                    msg: "Apellido no puede estar vacío"
                },
                len: {
                    args: [2, 50],
                    msg: "Apellido fuera de rango: [2-50]"
                }
            }
        },
        rut: {
            type: DataTypes.STRING(12),
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [10, 12],
                    msg: "Largo del rut fuera de rango [10 - 12]"
                }
            }
        },
        email: {
            type: DataTypes.STRING(150),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Se ha utilizado un formato incorrecto para el campo email."
                }
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "user", // We need to choose the model name
        tableName: "Users",
        timestamps: false,
        underscored: true
    },
);

export default User;