import { models } from './index.js';
import EducatorForWorkload from './educator-for-workload.js';

const { Workload, Educator, User, TokenModel } = models;

export default function () {
    Educator.belongsToMany(Workload, {
        through: EducatorForWorkload,
    });
    Workload.belongsToMany(Educator, {
        through: EducatorForWorkload,
    });
    User.hasOne(TokenModel, { foreignKey: 'userId' });
    TokenModel.belongsTo(User, { foreignKey: 'userId' });
}
