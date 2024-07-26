import { DataTypes, Model } from 'sequelize';
import EnumDepartments from '../config/departments.js';

export default class Materials extends Model {
    static initialize(sequelize) {
        Materials.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                number: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                fields: {
                    type: DataTypes.STRING(4096),
                    allowNull: false,
                },
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
                    type: DataTypes.STRING(400),
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
                    type: DataTypes.STRING(1000),
                    allowNull: false,
                },
                curriculumUnit: {
                    type: DataTypes.STRING(1000),
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
                    type: DataTypes.STRING(1200),
                    allowNull: false,
                },
                core: {
                    type: DataTypes.STRING(1200),
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
                isSplit: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                isMerged: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                notes: {
                    type: DataTypes.STRING(1024),
                    allowNull: true,
                    defaultValue: '',
                },
            },
            {
                sequelize,
                indexes: [
                    {
                        unique: true,
                        fields: ['fields'],
                    },
                ],
                schema: 'public',
                modelName: 'Materials',
                tableName: 'materials',
                paranoid: false,
            }
        );
        Materials.beforeBulkCreate(async models => {
            let maxNumber = await Materials.max('number');
            for (const model of models) {
                if (!maxNumber || maxNumber === 0) {
                    model.set('number', 1);
                } else {
                    model.set('number', maxNumber + 1);
                }
                maxNumber++;
            }
        });
    }
}
