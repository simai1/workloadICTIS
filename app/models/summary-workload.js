import { DataTypes, Model } from 'sequelize';
import getHours from '../utils/summary-workload.js';

export default class SummaryWorkload extends Model {
    static initialize(sequelize) {
        SummaryWorkload.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                totalKafedralHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                totalOIDHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                totalHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                kafedralAutumnWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
                kafedralSpringWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
                kafedralAdditionalWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
                instituteAutumnWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
                instituteSpringWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
                instituteManagementWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'SummaryWorkload',
                tableName: 'summary-workload',
                paranoid: true,
            }
        );
        SummaryWorkload.beforeUpdate(summaryWorkload => {
            getHours(summaryWorkload);
        });

        // При обновлении нагрузки просчитывать часы
    }
}
