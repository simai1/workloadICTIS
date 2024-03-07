import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/login').get(asyncRoute(authController.login));
router.route('/test').post(asyncRoute(authController.test));
router.route('/loginSfedu').post(asyncRoute(authController.loginSfedu));
export default router;
