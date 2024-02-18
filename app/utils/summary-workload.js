import SummaryWorkload from '../models/summary-workload.js';
import Workload from '../models/workload.js';

// Устанавливаем итоговые часы
async function setHours(workload) {
    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: workload.educatorId } });

    const hours = {
        kafedralAutumnWorkload: 0,
        kafedralSpringWorkload: 0,
        kafedralAdditionalWorkload: 0,
        instituteAutumnWorkload: 0,
        instituteSpringWorkload: 0,
        instituteManagementWorkload: 0,
        totalKafedralHours: 0,
        totalOidHours: 0,
        totalHours: 0,
    };

    // Проверяем предмет на общеинститутский ли он и период и устанавливаем часы для кафедральных или институтских дисциплин
    if (workload.isOid === false && workload.period === 1) hours.kafedralAutumnWorkload += workload.hours;
    if (workload.isOid === false && workload.period === 2) hours.kafedralSpringWorkload += workload.hours;
    if (workload.isOid === false && !workload.period) hours.kafedralAdditionalWorkload += workload.hours;
    if (workload.isOid === true && workload.period === 1) hours.instituteAutumnWorkload += workload.hours;
    if (workload.isOid === true && workload.period === 2) hours.instituteSpringWorkload += workload.hours;
    if (workload.isOid === true && !workload.period) hours.instituteManagementWorkload += workload.hours;

    // Итоговые часы для кафедральных, общеинститутских предметов и общей нагрузки
    hours.totalKafedralHours =
        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
    hours.totalOidHours =
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    hours.totalHours = hours.totalKafedralHours + hours.totalOidHours;

    // Заполняем бд этими данными
    summaryWorkload.set('totalKafedralHours', summaryWorkload.totalKafedralHours + hours.totalKafedralHours);
    summaryWorkload.set('totalOidHours', summaryWorkload.totalOidHours + hours.totalOidHours);
    summaryWorkload.set('totalHours', summaryWorkload.totalHours + hours.totalHours);
    summaryWorkload.set(
        'kafedralAutumnWorkload',
        summaryWorkload.kafedralAutumnWorkload + hours.kafedralAutumnWorkload
    );
    summaryWorkload.set(
        'kafedralSpringWorkload',
        summaryWorkload.kafedralSpringWorkload + hours.kafedralSpringWorkload
    );
    summaryWorkload.set(
        'kafedralAdditionalWorkload',
        summaryWorkload.kafedralAdditionalWorkload + hours.kafedralAdditionalWorkload
    );
    summaryWorkload.set(
        'instituteAutumnWorkload',
        summaryWorkload.instituteAutumnWorkload + hours.instituteAutumnWorkload
    );
    summaryWorkload.set(
        'instituteSpringWorkload',
        summaryWorkload.instituteSpringWorkload + hours.instituteSpringWorkload
    );
    summaryWorkload.set(
        'instituteManagementWorkload',
        summaryWorkload.instituteManagementWorkload + hours.instituteManagementWorkload
    );

    await summaryWorkload.save();
}

async function deleteHours(newWorkload) {
    const workload = await Workload.findByPk(newWorkload.id);
    if (workload.educatorId === null) return;
    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: workload.educatorId } });

    const hours = {
        kafedralAutumnWorkload: 0,
        kafedralSpringWorkload: 0,
        kafedralAdditionalWorkload: 0,
        instituteAutumnWorkload: 0,
        instituteSpringWorkload: 0,
        instituteManagementWorkload: 0,
        totalKafedralHours: 0,
        totalOidHours: 0,
        totalHours: 0,
    };

    // Проверяем предмет на общеинститутский ли он и период и устанавливаем часы для кафедральных или институтских дисциплин
    if (workload.isOid === false && workload.period === 1) hours.kafedralAutumnWorkload += workload.hours;
    if (workload.isOid === false && workload.period === 2) hours.kafedralSpringWorkload += workload.hours;
    if (workload.isOid === false && !workload.period) hours.kafedralAdditionalWorkload += workload.hours;
    if (workload.isOid === true && workload.period === 1) hours.instituteAutumnWorkload += workload.hours;
    if (workload.isOid === true && workload.period === 2) hours.instituteSpringWorkload += workload.hours;
    if (workload.isOid === true && !workload.period) hours.instituteManagementWorkload += workload.hours;

    hours.totalKafedralHours =
        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
    hours.totalOidHours =
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    hours.totalHours = hours.totalKafedralHours + hours.totalOidHours;

    summaryWorkload.set('totalKafedralHours', summaryWorkload.totalKafedralHours - hours.totalKafedralHours);
    summaryWorkload.set('totalOidHours', summaryWorkload.totalOidHours - hours.totalOidHours);
    summaryWorkload.set('totalHours', summaryWorkload.totalHours - hours.totalHours);
    summaryWorkload.set(
        'kafedralAutumnWorkload',
        summaryWorkload.kafedralAutumnWorkload - hours.kafedralAutumnWorkload
    );
    summaryWorkload.set(
        'kafedralSpringWorkload',
        summaryWorkload.kafedralSpringWorkload - hours.kafedralSpringWorkload
    );
    summaryWorkload.set(
        'kafedralAdditionalWorkload',
        summaryWorkload.kafedralAdditionalWorkload - hours.kafedralAdditionalWorkload
    );
    summaryWorkload.set(
        'instituteAutumnWorkload',
        summaryWorkload.instituteAutumnWorkload - hours.instituteAutumnWorkload
    );
    summaryWorkload.set(
        'instituteSpringWorkload',
        summaryWorkload.instituteSpringWorkload - hours.instituteSpringWorkload
    );
    summaryWorkload.set(
        'instituteManagementWorkload',
        summaryWorkload.instituteManagementWorkload - hours.instituteManagementWorkload
    );
    await summaryWorkload.save();
}

export { setHours, deleteHours };
