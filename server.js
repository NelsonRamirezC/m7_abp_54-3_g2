import 'dotenv/config';
import app from "./src/app.js";
import sequelize from "./src/config/db.js";

import "./src/models/index.js";

const PORT = process.env.SERVER_PORT || 3000;

const main = async () => {
    try {
        await sequelize.sync();
        console.log("Conectados a la base de datos...");
        app.listen(PORT, () => {
            console.log("Servidor escuchando en http://localhost:" + PORT);
        });
    } catch (error) {
        console.log("Ha fallado levantar la API.");
        console.error(error);
    }
};

main();
