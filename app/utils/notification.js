import SummaryWorkload from '../models/summary-workload.js';
import Notification from '../models/notifications.js';
import Educator from '../models/educator.js';
import { EventEmitter } from 'events';
import ioClient from 'socket.io-client';
import { Op } from 'sequelize';
import { notificationMessages } from '../const/messages.js';

const eventEmitter = new EventEmitter();
const eventQueue = [];
const socket = ioClient('http://localhost:4000');

async function createNotification(message, educatorId) {
    try {
        const notification = await Notification.create({ message, educatorId });
        eventEmitter.emit('notificationCreated', { notification });
        socket.emit('notificationCreated', { notification });
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
        console.log('Туть');
        const educator = await Educator.findByPk(summaryWorkload.educatorId);
        const { maxHours, recommendedMaxHours, minHours } = educator;
        const totalHours = summaryWorkload.totalHours;

        console.log('Max Hours:', maxHours);
        console.log('Recommended Max Hours:', recommendedMaxHours);
        console.log('Min Hours:', minHours);
        console.log('Total Hours:', totalHours);

        const existingNotification = await Notification.findOne({
            where: { educatorId: summaryWorkload.educatorId },
        });

        const notificationMessage = getNotificationMessage(totalHours, minHours, maxHours, recommendedMaxHours);

        if (existingNotification) {
            // Если есть уведомление и условия не соблюдаются, удаляем его
            if (!notificationMessage) {
                await existingNotification.destroy({ force: true });
                console.log('Уведомление удалено', existingNotification);
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
                console.log('Уведомление обновлено', existingNotification);
                eventEmitter.emit('notificationCreated', { existingNotification });
            }
        }
    } catch (error) {
        console.error('Ошибка в checkHours:', error);
    }
}

eventEmitter.on('notificationCreated', (eventData) => {
    eventQueue.push(eventData);
    const messageValue = eventQueue.length;
    socket.emit('notificationCreated', eventData);
    console.log('Message Value:', messageValue);
});

export { eventEmitter };
