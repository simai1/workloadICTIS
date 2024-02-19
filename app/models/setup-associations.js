import { models } from './index.js';
import SummaryWorkload from './summary-workload.js';

const { Educator, Workload, User, TokenSchema } = models;

export default function () {
    Educator.hasMany(Workload);
    Workload.belongsTo(Educator, { constraints: false });


    User.hasOne(TokenModel, { foreignKey: 'userId' });
    TokenModel.belongsTo(User, { foreignKey: 'userId' });
  
    Educator.hasOne(SummaryWorkload);
    SummaryWorkload.belongsTo(Educator);

}



