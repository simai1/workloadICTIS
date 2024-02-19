import SummaryWorkload from '../models/summary-workload.js';

//Создаем запись в таблице summary-workload
export default async function createSummaryWorkload(educatorId) {
    await SummaryWorkload.create({
        educatorId,
    });
}
