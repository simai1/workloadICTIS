import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import NotificationDto from '../dtos/notification-dto.js';
import User from '../models/user.js';
import { Sequelize } from 'sequelize';

export default {
    async getAllNotifications(req, res) {
        try {
            const _user = await User.findByPk(req.user,{ include: Educator });
            let notifications ;
            if(_user.role === 3){
                notifications = await Notification.findAll({
                    include: [
                        {
                            model: Educator,
                            attributes: { exclude: ['EducatorId'] }, 
                            where: {
                                department: _user.Educator.department, 
                            },
                        }
                    ],
                });
            } else{
                notifications = await Notification.findAll({
                    include: { model: Educator },
                    attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
                });
            }
            const notificationDto = notifications.map(notification => new NotificationDto(notification));

            res.json(notificationDto);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
