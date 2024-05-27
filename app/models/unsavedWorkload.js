import { DataTypes, Model } from 'sequelize';
import EnumDepartments from '../config/departments.js';
// import { deleteHours, setHours } from '../utils/summary-workload.js';
// import checkHours from '../utils/notification.js';
export default class UnsavedWorkload extends Model {
  static initialize(sequelize) {
    UnsavedWorkload.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
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
          type: DataTypes.STRING(600),
          allowNull: false,
        },
        curriculumUnit: {
          type: DataTypes.STRING(600),
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
        comment: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isSplit: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        originalId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        educatorId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        isOid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        }
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'UnsavedWorkload',
        tableName: 'unsavedWorkloads',
        paranoid: true,
      }
    );

    // UnsavedWorkload.beforeDestroy(async workload => {
    //   await deleteHours(workload);
    // });
    //
    // UnsavedWorkload.beforeUpdate(async workload => {
    //   await deleteHours(workload);
    // });
    //
    // UnsavedWorkload.afterUpdate(async workload => {
    //   await setHours(workload);
    // });
  }
}
