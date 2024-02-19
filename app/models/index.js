import { Sequelize } from 'sequelize';
import 'dotenv/config';
import Notification from './notifications.js';
import Workload from './workload.js';
import Educator from './educator.js';
import User from './user.js';
import SummaryWorkload from './summary-workload.js';
import TokenSchema from './token-model.js';


const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const models = {
    Notification,
    SummaryWorkload,
    Educator,
    Workload,
    User,
    TokenSchema,
};
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        // multipleStatements: true,
        typeCast: true,
    },
    define: {
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true,
    },
    logging: false,
});
