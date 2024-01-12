import { models } from "./index.js";
import EducatorForWorkload from "./educator-for-workload.js";
const { Workload, Educator } = models;

export default function () {
    Educator.belongsToMany(Workload,{
        through: EducatorForWorkload,
    });
    Workload.belongsToMany(Educator, {
        through: EducatorForWorkload,
    });
}