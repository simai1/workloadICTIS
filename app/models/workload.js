import { DataTypes, Model } from 'sequelize';
import EnumDepartments from '../config/departments.js';

export default class Workload extends Model {
	static initialize(sequelize) {
		Workload.init(
			{
				department: {
					type: DataTypes.SMALLINT,
					allowNull: false,
					validate: {
						isIn: [Object.values(EnumDepartments)],
					},
				},
				discipline: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				workload: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				groups: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				block: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				semester: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				period: {
					type: DataTypes.SMALLINT,
				},
				curriculum: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				curriculumUnit: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				formOfEducation: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				levelOfTraining: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				specialty: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				core: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				numberOfStudents: {
					type: DataTypes.SMALLINT,
				},
				hours: {
					type: DataTypes.REAL,
				},
				audienceHours: {
					type: DataTypes.REAL,
				},
				ratingControlHours: {
					type: DataTypes.REAL,
					allowNull: true,
				},
				comment: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				schema: 'public',
				modelName: 'Workload',
				tableName: 'workloads',
				paranoid: true,
			}
		);
	}
}
