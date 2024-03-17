import Notification from '../models/notifications.js';
import Educator from '../models/educator.js';
import { EventEmitter } from 'events';
import { notificationMessages } from '../const/messages.js';

const eventEmitter = new EventEmitter();
const eventQueue = [];
let isProcessing = false;

async function createNotification(message, educatorId) {
    try {
        const notification = await Notification.create({ message, educatorId });
        eventEmitter.emit('notificationCreated', { notification });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

function getNotificationMessage(totalHours, minHours, maxHours, recommendedMaxHours) {
    if (totalHours < minHours) return notificationMessages.underMin;
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
        });

        const notificationMessage = getNotificationMessage(totalHours, minHours, maxHours, recommendedMaxHours);

        if (existingNotification) {
            // Если есть уведомление и условия не соблюдаются, удаляем его
            if (!notificationMessage) {
                await existingNotification.destroy({ force: true });
            }
        } else {
            // Если нет уведомления и условия не соблюдаются, создаем новое уведомление
            if (notificationMessage) {
                createNotification(notificationMessage, summaryWorkload.educatorId);
            }
        }

        // Обработка изменения условий в существующем уведомлении
        if (existingNotification && notificationMessage) {
            const existingMessage = existingNotification.message;

            if (existingMessage !== notificationMessage) {
                existingNotification.message = notificationMessage;
                await existingNotification.save();
                eventEmitter.emit('notificationCreated', { existingNotification });
            }
        }
    } catch (error) {
        console.error('Ошибка в checkHours:', error);
    }
}

eventEmitter.on('notificationCreated', eventData => {
    if (!isProcessing) {
        isProcessing = true;
        eventQueue.push(eventData);
        const messageValue = eventQueue.length;
        // Отправка уведомлений на клиент через WebSocket
        // Вам нужно заменить 'notificationCreated' на ваше событие, если оно имеет другое имя
        eventEmitter.emit('notificationCreated', eventData);
        console.log('Message Value:', messageValue);
        isProcessing = false;
    }
});

export { eventEmitter };
