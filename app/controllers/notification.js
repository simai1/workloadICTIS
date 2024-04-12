import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import NotificationDto from '../dtos/notification-dto.js';

export default {
    async getAllNotifications(req, res) {
        try {
            const notifications = await Notification.findAll({
                include: { model: Educator },
                attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
            });

            const notificationDto = notifications.map(notification => new NotificationDto(notification));

            res.json(notificationDto);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
