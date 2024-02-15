import summaryWorkload from "../models/summary-workload.js";

export default async function createSummaryWorkload(workloadId) {
    const summaryWorkload = await summaryWorkload.create({
        WorkloadId: workloadId,
    });
    console.log('Я вызвался')
}