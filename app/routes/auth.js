import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/login').get(asyncRoute(authController));
export default router;
