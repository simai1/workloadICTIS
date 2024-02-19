import SummaryWorkload from '../models/summary-workload.js';
import Workload from '../models/workload.js';

export default async function checkHours(educatorId, res) {

    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId } });

    if(summaryWorkload.totalHours < 100) {
        res.status(303).json({ status: 'Необходимо посмотреть часы преподователей, слишком большая нагрузка' });
    }
}
