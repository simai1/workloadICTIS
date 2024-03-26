import { DataTypes, Model } from 'sequelize';
import EnumStatus from '../config/status.js';

export default class Offer extends Model {
    static initialize(sequelize) {
        Offer.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                workloadId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                proposerId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.SMALLINT,
                    defaultValue: 3,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(EnumStatus)],
                    },
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Offer',
                tableName: 'offers',
                paranoid: true,
            }
        );
    }
}
