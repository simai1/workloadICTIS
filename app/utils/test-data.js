import Workload from '../models/workload.js';
import { educators, workloads } from '../config/test-data.js';
import Educator from '../models/educator.js';

async function fillWorkload() {
    for (const x of workloads) {
        const workload = await Workload.findOne({
            where: {
                discipline: x.discipline,
                workload: x.workload,
            },
        });
        if (!workload) {
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
                isSplit: x.isSplit,
                educatorId: null,
                isOid: x.isOid,
                kafedralAutumnWorkload: x.kafedralAutumnWorkload,
                kafedralSpringWorkload: x.kafedralSpringWorkload,
                kafedralAdditionalWorkload: x.kafedralAdditionalWorkload,
                instituteAutumnWorkload: x.instituteAutumnWorkload,
                instituteSpringWorkload: x.instituteSpringWorkload,
                instituteManagementWorkload: x.instituteAutumnWorkload,
            });
        }
    }
}

async function fillEducators() {
    for (const x of educators) {
        const educator = await Educator.findOne({
            where: {
                name: x.name,
            },
        });
        if (!educator) {
            await Educator.create({
                name: x.name,
                position: x.position,
                email: x.email || null,
                department: x.department,
                rate: x.rate,
                maxHours: x.maxHours,
                recommendedMaxHours: x.recommendedMaxHours,
                minHours: x.minHours,
            });
        }
    }
}

export default {
    fillWorkload,
    fillEducators,
};
