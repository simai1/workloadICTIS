    import SummaryWorkload from '../models/summary-workload.js';
    import Notification from '../models/notifications.js';
    import Educator from '../models/educator.js';
    import { EventEmitter } from 'events';
    import ioClient from 'socket.io-client';


    const eventEmitter = new EventEmitter();

    const eventQueue = [];

    // Создаем соединение с сервером клиента
    // const socket = ioClient('http://localhost:4000'); // Обновите порт, если вы используете другой порт для сервера клиента

    export default async function checkHours(summaryWorkload) {
        console.log('Туть');
        const educator = await Educator.findByPk(summaryWorkload.educatorId);
        //Create notification if Educators max and recomended hours > or < than summaryworkload totalHours
        const maxHours = educator.maxHours;
        const recommendedMaxHours = educator.recommendedMaxHours;
        const minHours = educator.minHours;

        const totalHours = summaryWorkload.totalHours;
        console.log('Max Hours:', maxHours);
        console.log('Recomended Max Hours:',recommendedMaxHours);
        console.log('Min Hours:', minHours);
        console.log('Total Hours:', totalHours);
    
        if (totalHours < minHours) {
            const notification = await Notification.create({
                message: 'Нужно увеличить нагрузку для преподавателя',
                educatorId: summaryWorkload.educatorId,
            });
            console.log('Сработало тут 3');

            eventEmitter.emit('notificationCreated', { notification });
    
            // Отправляем уведомление на сервер клиента
            // socket.emit('notificationCreated', { notification });
    
        } else if (totalHours > maxHours) {
            const notification = await Notification.create({
                message: 'Превышены максимальные часы для преподавателя',
                educatorId: summaryWorkload.educatorId,
            });
            console.log('Сработало тут 2');

            eventEmitter.emit('notificationCreated', { notification });
    
            // Отправляем уведомление на сервер клиента
            // socket.emit('notificationCreated', { notification });
    
        } else if (totalHours > recommendedMaxHours) {
            const notification = await Notification.create({
                message: 'Превышены рекомендуемые максимальные часы для преподавателя',
                educatorId: summaryWorkload.educatorId,
            });
            console.log('Сработало тут');
            eventEmitter.emit('notificationCreated', { notification });
    
            // Отправляем уведомление на сервер клиента
            // socket.emit('notificationCreated', { notification });
        }
    }

    eventEmitter.on('notificationCreated', eventData => {
        eventQueue.push(eventData);
        const messageValue = eventQueue.length;
        console.log('Message Value:', messageValue);
    });
    
    export { eventEmitter }; // Export eventEmitter for use in other parts of your application
