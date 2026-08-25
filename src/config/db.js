import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const dialect = "postgres";

const connectionOptions = {
    dialect,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
};

if (databaseUrl) {
    connectionOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, connectionOptions)
    : new Sequelize(
          process.env.PG_DATABASE,
          process.env.PG_USER,
          process.env.PG_PASSWORD,
          {
              ...connectionOptions,
              host: process.env.PG_HOST,
              port: process.env.PG_PORT,
          },
      );

export default sequelize;
