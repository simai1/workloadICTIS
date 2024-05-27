import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import userController from '../controllers/user.js';

const router = Router();
router.use(verify.general);

router.route('/').get(asyncRoute(userController.getUser));

export default router;
