import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Profile extends Model {}

Profile.init(
    {
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique:true,
            validate: {
                notNull: {
                    msg: "El nombre de usuario no acepta valores nulos"
                },
                notEmpty: {
                    msg: "El nombre de usuario no puede estar vacío"
                },
                len: {
                    args: [3, 20],
                    msg: "Nombre de usuario fuera de rango: [3-50]"
                },
                is: {
                    args: [/^[a-z0-9._-]{3,20}$/i],
                    msg: "Username no cumple con formato requerido, ejemplo: [user_dev / user.dev / user-dev.]"
                }
            }
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "profile", // We need to choose the model name
        tableName: "Profiles",
        timestamps: false,
        underscored: true
    },
);

export default Profile;