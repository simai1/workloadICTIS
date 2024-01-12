import { DataTypes, Model } from 'sequelize';
import EnumTypes from '../config/position';
import EnumTypeOfEmployment from '../config/type-of-employment';

export default class Educator extends Model {
	static initialize(sequelize) {
		Educator.init(
			{
				employee: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				position: {
					type: DataTypes.SMALLINT,
					allowNull: false,
					validate: {
						isIn: [Object.values(EnumTypes)],
					},
				},
				typeOfEmployment: {
					type: DataTypes.SMALLINT,
					allowNull: false,
					validate: {
						isIn: [Object.values(EnumTypeOfEmployment)],
					},
				},
				rate: {
					type: DataTypes.REAL,
					allowNull: false,
				},
				maxHours: {
					type: DataTypes.REAL,
					allowNull: false,
					defaultValue: 0,
				},
				recommendedMaxHours: {
					type: DataTypes.REAL,
					allowNull: false,
					defaultValue: 0,
				},
				minHours: {
					type: DataTypes.REAL,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				schema: 'public',
				modelName: 'Educator',
				tableName: 'educators',
				paranoid: true,
			}
		);
	}
}
