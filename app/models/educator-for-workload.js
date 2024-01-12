import {DataTypes, Model} from "sequelize";
import Educator from "./educator.js";
import Workload from "./workload.js";


export default class EducatorForWorkload extends Model{
    static initialize(sequelize) {
        EducatorForWorkload.init({
            EducatorId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Educator,
                    key: 'id',
                },
                allowNull: false,
            },
            WorkloadId:{
                type: DataTypes.INTEGER,
                references: {
                    model: Workload,
                    key: 'id',
                },
                allowNull: false,
            },
        },
{
            sequelize,
            schema: 'public',
            modelName: 'EducatorForWorkload',
            tableName: 'educator_for_workload',
            timestamps: false,
        })
    }
}