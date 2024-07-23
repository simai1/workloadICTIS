import { Sequelize } from 'sequelize';
import 'dotenv/config';
import Notification from './notifications.js';
import Workload from './workload.js';
import Educator from './educator.js';
import User from './user.js';
import SummaryWorkload from './summary-workload.js';
import TokenSchema from './token-model.js';
import Comment from './comment.js';
import History from "./history.js";
import Offers from './offers.js';
import Color from './color.js';
import Attaches from './attached.js';
import Materials from "./materials.js";

const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const models = {
    Notification,
    SummaryWorkload,
    Educator,
    Materials,
    Workload,
    User,
    TokenSchema,
    Color,
    Comment,
    History,
    Offers,
    Attaches,
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
