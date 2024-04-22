import SummaryWorkload from '../models/summary-workload.js';
import checkHours from './notification.js';

// Устанавливаем итоговые часы
async function setHours(newWorkload) {
    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: newWorkload.educatorId } });
    if (!summaryWorkload) return;

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
    if (!newWorkload.isOid && newWorkload.period === 1) hours.kafedralAutumnWorkload += parseFloat(newWorkload.hours);
    if (!newWorkload.isOid && newWorkload.period === 2) hours.kafedralSpringWorkload += parseFloat(newWorkload.hours);
    if (!newWorkload.isOid && !newWorkload.period) hours.kafedralAdditionalWorkload += parseFloat(newWorkload.hours);
    if (newWorkload.isOid && newWorkload.period === 1) hours.instituteAutumnWorkload += parseFloat(newWorkload.hours);
    if (newWorkload.isOid && newWorkload.period === 2) hours.instituteSpringWorkload += parseFloat(newWorkload.hours);
    if (newWorkload.isOid && !newWorkload.period) hours.instituteManagementWorkload += parseFloat(newWorkload.hours);

    hours.totalKafedralHours +=
        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
    hours.totalOidHours +=
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    hours.totalHours += hours.totalKafedralHours + hours.totalOidHours;

    summaryWorkload.kafedralAutumnWorkload += hours.kafedralAutumnWorkload;
    summaryWorkload.kafedralSpringWorkload += hours.kafedralSpringWorkload;
    summaryWorkload.kafedralAdditionalWorkload += hours.kafedralAdditionalWorkload;
    summaryWorkload.instituteAutumnWorkload += hours.instituteAutumnWorkload;
    summaryWorkload.instituteSpringWorkload += hours.instituteSpringWorkload;
    summaryWorkload.instituteManagementWorkload += hours.instituteManagementWorkload;
    summaryWorkload.totalKafedralHours += hours.totalKafedralHours;
    summaryWorkload.totalOidHours += hours.totalOidHours;
    summaryWorkload.totalHours += hours.totalHours;

    await summaryWorkload.save();
    await checkHours(summaryWorkload);
}

async function deleteHours(newWorkload) {
    const previousWorkload = newWorkload._previousDataValues;
    if (previousWorkload.educatorId === null) return;
    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: previousWorkload.educatorId } });

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
    if (!newWorkload.isOid && newWorkload.period === 1)
        hours.kafedralAutumnWorkload += parseFloat(previousWorkload.hours);
    if (!newWorkload.isOid && newWorkload.period === 2)
        hours.kafedralSpringWorkload += parseFloat(previousWorkload.hours);
    if (!newWorkload.isOid && !newWorkload.period)
        hours.kafedralAdditionalWorkload += parseFloat(previousWorkload.hours);
    if (newWorkload.isOid && newWorkload.period === 1)
        hours.instituteAutumnWorkload += parseFloat(previousWorkload.hours);
    if (newWorkload.isOid && newWorkload.period === 2)
        hours.instituteSpringWorkload += parseFloat(previousWorkload.hours);
    if (newWorkload.isOid && !newWorkload.period)
        hours.instituteManagementWorkload += parseFloat(previousWorkload.hours);

    hours.totalKafedralHours +=
        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
    hours.totalOidHours +=
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    hours.totalHours += hours.totalKafedralHours + hours.totalOidHours;

    summaryWorkload.kafedralAutumnWorkload -= hours.kafedralAutumnWorkload;
    summaryWorkload.kafedralSpringWorkload -= hours.kafedralSpringWorkload;
    summaryWorkload.kafedralAdditionalWorkload -= hours.kafedralAdditionalWorkload;
    summaryWorkload.instituteAutumnWorkload -= hours.instituteAutumnWorkload;
    summaryWorkload.instituteSpringWorkload -= hours.instituteSpringWorkload;
    summaryWorkload.instituteManagementWorkload -= hours.instituteManagementWorkload;
    summaryWorkload.totalKafedralHours -= hours.totalKafedralHours;
    summaryWorkload.totalOidHours -= hours.totalOidHours;
    summaryWorkload.totalHours -= hours.totalHours;
    await summaryWorkload.save();
}

export { setHours, deleteHours };
