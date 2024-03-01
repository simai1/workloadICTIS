import Notification from "../models/notifications.js";


export default {
    async getAllNotifications(req, res) {
        try {
            const notifications = await Notification.findAll();
            res.json(notifications);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
