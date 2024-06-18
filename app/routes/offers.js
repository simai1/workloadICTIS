import { Router } from 'express';
import offersController from '../controllers/offers.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.METHODIST, role.DIRECTORATE])),
        asyncRoute(offersController.getAllOffers)
    );
router
    .route('/getAllOffersByLecture')
    .get(
        asyncRoute(checkRole([role.LECTURER])),
        asyncRoute(offersController.getAllOffersByLecture)
    )
router
    .route('/createOffer')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.LECTURER])), 
        asyncRoute(offersController.createOffer)
    );
router
    .route('/introduceOrDecline/:offerId')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.METHODIST])),
        asyncRoute(offersController.introducedOrDeclined)
    );
router
    .route('/confirmOrReject/:offerId')
    .post(
        asyncRoute(checkRole([role.DIRECTORATE])),
        asyncRoute(offersController.confirmOrReject)
    );
router
    .route('/delete/:offerId')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE])), 
        asyncRoute(offersController.deleteOffer)
    );
export default router;
