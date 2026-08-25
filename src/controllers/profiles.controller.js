import Profile from "../models/Profile.model.js";

export const getProfileById = async (req, res) => {
    try {
        let { id } = req.params;

        const profile = await Profile.findByPk(id);

        res.json({ profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getExistUsername = async (req, res) => {
    try {
        let { username } = req.params;

        const existUsername = await Profile.findOne({ where: { username } });

        if(existUsername){
            return res.json({ exist: true});
        }else{
            return res.json({ exist: false})
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateUsername = async (req, res) => {
    try {
        let { id } = req.params;

        let { username } = req.body;

        if (!username) {
            return res
                .status(400)
                .json({ message: "No se proporciona en campo username." });
        }

        const result = await Profile.update(
            { username },
            {
                where: {
                    id,
                },
            },
        );

        if (result == 0) {
            return res.status(404).json({
                message: "No existe ningún perfil asociado a ID: " + id,
            });
        }

        res.json({
            message: `Actualización con éxito, su nuevo nombre de perfil es: ${username}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
