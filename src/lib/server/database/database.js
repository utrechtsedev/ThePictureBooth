import { Sequelize } from "sequelize";
import dotenv from 'dotenv'; dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mariadb",
  logging: false,
  ssl: true,
  timezone: "+02:00"
});



export { sequelize };
