import { DataTypes, Model } from 'sequelize';
import EnumHistoryType from '../config/history-type.js';
import departments from "../config/departments.js";
export default class History extends Model {
  static initialize(sequelize) {
    History.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        type: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isIn: [Object.values(EnumHistoryType)],
          },
        },
        department: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isIn: [Object.values(departments)],
          },
        },
        before: {
          type: DataTypes.ARRAY(DataTypes.UUID),
          allowNull: false,
        },
        after: {
          type: DataTypes.ARRAY(DataTypes.UUID),
          allowNull: false,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'History',
        tableName: 'histories',
        paranoid: true,
      }
    );
  }
}
