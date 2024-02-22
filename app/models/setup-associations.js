import { models } from './index.js';
import Notification from './notifications.js';
import SummaryWorkload from './summary-workload.js';

const { Educator, Workload, User, TokenSchema } = models;

export default function () {
    Educator.hasMany(Workload);
    Workload.belongsTo(Educator, { constraints: false });

    Educator.hasOne(SummaryWorkload);
    SummaryWorkload.belongsTo(Educator);

    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });

    Educator.hasMany(Notification);
    Notification.belongsTo(Educator);
}



