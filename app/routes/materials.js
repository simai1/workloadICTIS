import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import materialsController from '../controllers/materials.js';
import verify from '../middlewares/verify-token.js';
// import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router.route('/').get(asyncRoute(materialsController.getAll));
router.route('/sync').get(asyncRoute(materialsController.sync));
router
    .route('/:materialId')
    .delete(asyncRoute(materialsController.deleteMaterial))
    .patch(asyncRoute(materialsController.setNote));

export default router;
