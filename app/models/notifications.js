import { DataTypes, Model } from 'sequelize';

export default class Notification extends Model {
    static initialize(sequelize) {
        Notification.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                message: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                // receiverRoles: { type: DataTypes.ARRAY(DataTypes.SMALLINT) },
                isChecked: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Notification',
                tableName: 'notifications',
                paranoid: true,
            }
        );
    }
}
