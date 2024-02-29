import { Router } from 'express';
import notificationController from '../controllers/notification.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/').get(asyncRoute(notificationController.getAllNotifications));

export default router;
