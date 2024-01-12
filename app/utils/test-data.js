import Workload from '../models/workload.js';
import { workloads } from "../config/test-data.js";

async function fillWorkload() {
    for (const x of workloads) {
        const flower = await Workload.findOne({
            where: {
                discipline: x.discipline,
                workload: x.workload,
            },
        });
        if (!flower) {
            await Workload.create({
                department: x.department,
                discipline: x.discipline,
                workload: x.workload,
                groups: x.groups,
                block: x.block,
                semester: x.semester,
                period: x.period,
                curriculum: x.curriculum,
                curriculumUnit: x.curriculumUnit,
                formOfEducation: x.formOfEducation,
                levelOfTraining: x.levelOfTraining,
                specialty: x.specialty,
                core: x.core,
                numberOfStudents: x.numberOfStudents,
                hours: x.hours,
                audienceHours: x.audienceHours,
            });
        }
    }
}

export default {
    fillWorkload,
};
