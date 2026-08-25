import { Sequelize } from "sequelize";

const database = process.env.PG_DATABASE;
const username = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const dialect = process.env.PG_DIALECT;
const port = process.env.PG_PORT;

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    port,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export default sequelize;
