import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import sequelize from "../config/db.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Profile,
                    as: "profile",
                    attributes: ["username"],
                },
            ],
        });

        res.json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        let { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ["password", "rut"] },
        });

        const profile = await user.getProfile();

        res.json({ user, profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { firstName, lastName, rut, email, password, username } = req.body;

        if (
            !firstName ||
            !lastName ||
            !rut ||
            !email ||
            !password ||
            !username
        ) {
            await t.rollback();
            return res.status(400).json({
                message:
                    "No se proporcionan los campos requeridos, consulte la documentación: [firstName, lastName, rut, email, password, username]",
            });
        }

        let user = await User.create(
            {
                firstName,
                lastName,
                rut,
                email,
                password,
            },
            { transaction: t },
        );

        await Profile.create({ id: user.id, username }, { transaction: t });

        user = user.toJSON();
        delete user.password;
        user.username = username;

        await t.commit();
        res.status(201).json({ message: "Usuario creado con éxito.", user });
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        let { id } = req.params;

        let user = await User.findByPk(id);

        if (!user) {
            return res
                .status(404)
                .json({ message: "No existe ningún usuario con el id: " + id });
        }

        await user.update(req.body);

        user = user.toJSON();
        delete user.password;

        res.status(201).json({
            message: "Usuario actualizado con éxito.",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        let { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res
                .status(404)
                .json({ message: "No existe ningún usuario con id: " + id });
        }

        await user.destroy();

        res.json({
            message: `Se eliminó de la BD al usuario ${user.firstName} ${user.lastName}.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
