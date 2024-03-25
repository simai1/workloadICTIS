import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';

export default {
    async getAllNotifications(req, res) {
        try {
            const notifications = await Notification.findAll({
                include: { model: Educator },
                attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
            });
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
