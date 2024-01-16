import { Router } from 'express';
import eduController from '../controllers/educator.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.get('/get', asyncRoute(eduController.getAll));

export default router;
