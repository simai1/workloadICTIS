import { DataTypes, Model } from 'sequelize';
import colors from '../config/color.js';

export default class Color extends Model {
    static initialize(sequelize) {
        Color.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                color: {
                    type: DataTypes.SMALLINT,
                    defaultValue: 1,
                    validate: {
                      isIn: [Object.values(colors)],
                    },
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
                modelName: 'Color',
                tableName: 'colors',
                paranoid: true,
            }
        );
    }
}
