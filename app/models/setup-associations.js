import { models } from './index.js';

const { Educator, Workload, User, TokenSchema } = models;

export default function () {
    Educator.hasMany(Workload);
    Workload.belongsTo(Educator, { constraints: false });

    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });
}
