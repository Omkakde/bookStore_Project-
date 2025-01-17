import {Sequelize} from "sequelize";
import dotenv from "dotenv";
import Logger from "./logger";

dotenv.config();

const logger= Logger.logger;
const DATABASE = `${process.env.DATABASE}`;
const USERNAME = `${process.env.USERNAME_DB}`;
const PASSWORD = `${process.env.PASSWORD}` ;
const HOST = `${process.env.HOST}`;
const PORT = parseInt(`${process.env.PORT}`);

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate()
         .then(() => {
            logger.info('Connected to database.');
         })
         .catch((error) => {
            logger.error('Could not connect to database.', error);
         });
sequelize.sync();

export {DataTypes} from 'sequelize';
export default sequelize;

