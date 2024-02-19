import SummaryWorkload from '../models/summary-workload.js';
import Notification from '../models/notifications.js';
import Educator from '../models/educator.js';

export default async function checkHours(summaryWorkload) {

    console.log('Туть');
    const educator = await Educator.findByPk(summaryWorkload.educatorId);
    //Create notification if Educators max and recomended hours > or < than summaryworkload totalHours
    const maxHours = educator.maxHours;
    const recommendedMaxHours = educator.recommendedMaxHours;
    const minHours = educator.minHours;

    const totalKafedralHours = summaryWorkload.totalKafedralHours;
    const totalOidHours = summaryWorkload.totalOidHours;
    const totalHours = summaryWorkload.totalHours;

    console.log(minHours);
    console.log(totalHours);
    if (totalHours < minHours) {
        await Notification.create({
            message: 'Нужно увеличить нагрузку для преподователя',
            educatorId: summaryWorkload.educatorId,
        });
    }
    console.log('Letsgooo');
}

// async function createNotification(existingNotification, educatorId, message, hours ) {

//     const notificationData = {
//         educatorId,
//         message: `${message}: ${hours} часов`,
//         isChecked: false,
//     }

//     if (existingNotification) {
//         await existingNotification.update(notificationData);
//     } else {
//         await notifications.create(notificationData);
//     }
// }
