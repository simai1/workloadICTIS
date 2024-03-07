import { Router } from 'express';
import commentContorller from '../controllers/comment.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/createComment').post(asyncRoute(commentContorller.createComment));
router.route('/delete/:commentId').delete(asyncRoute(commentContorller.deleteComment));
router.route('/getAllComment').get(asyncRoute(commentContorller.getAllComments));

export default router;
        