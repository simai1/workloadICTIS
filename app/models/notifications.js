import { DataTypes, Model } from 'sequelize';

export default class Notification extends Model {
    static initialize(sequelize) {
        Notification.init(
            {
                message: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                receiverRoles: { type: DataTypes.ARRAY(DataTypes.SMALLINT) },
                isChecked: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
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
