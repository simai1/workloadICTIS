import { DataTypes, Model } from 'sequelize';

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
                // userId: {
                //     type: DataTypes.UUID,
                //     allowNull: false,
                // },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                workloadId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.ENUM('принято', 'отклонено', 'ожидает'),
                    defaultValue: 'ожидает',
                    allowNull: false,
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
