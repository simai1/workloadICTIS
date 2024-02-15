import SummaryWorkload from '../models/summary-workload.js';

export default async function createSummaryWorkload(educatorId) {
    await SummaryWorkload.create({
        educatorId,
    });
}
