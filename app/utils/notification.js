import Notification from '../models/notifications.js';
import Educator from '../models/educator.js';
import { EventEmitter } from 'events';
import { notificationMessages } from '../const/messages.js';
import EducatorDto from '../dtos/educator-dto.js';

const eventEmitter = new EventEmitter();
// const eventQueue = [];
// let isProcessing = false;

async function createNotification(message, educator) {
    try {
        const notification = await Notification.create({ message, educatorId: educator.id });
        eventEmitter.emit('notificationCreated', { notification, educator: new EducatorDto(educator) });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

function getNotificationMessage(totalHours, minHours, maxHours, recommendedMaxHours) {
    if (totalHours < minHours && totalHours !==0 ) return notificationMessages.underMin;
    if (totalHours > maxHours) return notificationMessages.overMax;
    if (maxHours > totalHours && totalHours > recommendedMaxHours) return notificationMessages.overRecommendedMax;
    return null;
}

export default async function checkHours(summaryWorkload) {
    try {
        const educator = await Educator.findByPk(summaryWorkload.educatorId);
        const { maxHours, recommendedMaxHours, minHours } = educator;
        const totalHours = summaryWorkload.totalHours;

        const existingNotification = await Notification.findOne({
            where: { educatorId: summaryWorkload.educatorId },
            attributes: { exclude: ['EducatorId'] },
        });

        const notificationMessage = getNotificationMessage(totalHours, minHours, maxHours, recommendedMaxHours);

        if (existingNotification) {
            // Если есть уведомление и условия не соблюдаются, удаляем его
            if (!notificationMessage) {
                eventEmitter.emit('notificationCreated', 'Уведомление удалено');
                await existingNotification.destroy({ force: true });
            }
        } else {
            // Если нет уведомления и условия не соблюдаются, создаем новое уведомление
            if (notificationMessage) {
                createNotification(notificationMessage, educator);
            }
        }

        // Обработка изменения условий в существующем уведомлении
        if (existingNotification && notificationMessage) {
            const existingMessage = existingNotification.message;

            if (existingMessage !== notificationMessage) {
                existingNotification.message = notificationMessage;
                await existingNotification.save();
                eventEmitter.emit('notificationCreated', { existingNotification, educator: new EducatorDto(educator) });
            }
        }
    } catch (error) {
        console.error('Ошибка в checkHours:', error);
    }
}

export { eventEmitter };
