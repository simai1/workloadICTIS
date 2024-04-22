import { DataTypes, Model } from 'sequelize';

export default class Attaches extends Model {
    static initialize(sequelize) {
        Attaches.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                isAttach: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: false,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                workloadId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Attaches',
                tableName: 'attaches',
                paranoid: true,
            }
        );
    }
}
