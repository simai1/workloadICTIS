import { models } from './index.js';
import Notification from './notifications.js';
import SummaryWorkload from './summary-workload.js';

const { Educator, Workload, User, TokenSchema, Comment, Offers, Color, Attaches, Materials } = models;

export default function () {
    Educator.hasMany(Workload);
    Workload.belongsTo(Educator, { constraints: false });

    Educator.hasMany(Materials);
    Materials.belongsTo(Educator);

    Educator.hasOne(SummaryWorkload);
    SummaryWorkload.belongsTo(Educator);

    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });

    User.hasOne(Educator, { foreignKey: 'userId' });
    Educator.belongsTo(User, { foreignKey: 'userId' });

    Educator.hasMany(Notification);
    Notification.belongsTo(Educator);

    Workload.hasMany(Comment, { onDelete: 'CASCADE', hooks: true });
    Comment.belongsTo(Workload);

    Educator.hasMany(Comment);
    Comment.belongsTo(Educator);

    Educator.hasOne(Offers);
    Offers.belongsTo(Educator);

    Educator.hasMany(Color);
    Color.belongsTo(Educator);

    Workload.hasOne(Color, { onDelete: 'CASCADE', hooks: true });
    Color.belongsTo(Workload, { foreignKey: 'workloadId' });

    Educator.hasMany(Attaches);
    Attaches.belongsTo(Educator);

    Workload.hasOne(Attaches, { onDelete: 'CASCADE', hooks: true });
    Attaches.belongsTo(Workload, { foreignKey: 'workloadId' });
}
