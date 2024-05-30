import { Router } from 'express';
import historyController from '../controllers/history.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
  .route('/getAll')
  .get(
    asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
    asyncRoute(historyController.getAll),
  );

router
  .route('/delete/:historyId')
  .delete(
    asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
    asyncRoute(historyController.delete),
  )

export default router;
