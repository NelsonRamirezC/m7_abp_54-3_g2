import "dotenv/config";
import pg from "pg";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const dialect = "postgres";

const normalizedDatabaseUrl = databaseUrl
    ? (() => {
          const url = new URL(databaseUrl);
          url.searchParams.set("sslmode", "verify-full");
          return url.toString();
      })()
    : null;

const connectionOptions = {
    dialect,
    dialectModule: pg,
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
            rejectUnauthorized: true,
        },
    };
}

const sequelize = databaseUrl
    ? new Sequelize(normalizedDatabaseUrl, connectionOptions)
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
