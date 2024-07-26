import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import materialsController from '../controllers/materials.js';
import verify from '../middlewares/verify-token.js';

const router = Router();
router.use(verify.general);

router.route('/').get(asyncRoute(materialsController.getAll));
router.route('/sync').get(asyncRoute(materialsController.sync));
router
    .route('/:materialId')
    .delete(asyncRoute(materialsController.deleteMaterial))
router
    .route('/getUsableDepartments')
    .get(asyncRoute(materialsController.getUsableDepartments));
router.route('/:materialId').patch(asyncRoute(materialsController.update))

export default router;
