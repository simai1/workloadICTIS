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
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.METHODIST,
                role.DIRECTORATE,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(offersController.getAllOffers)
    );
router
    .route('/getAllOffersByLecture')
    .get(
        asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN, role.UNIT_ADMIN, role.LECTURER])),
        asyncRoute(offersController.getAllOffersByLecture)
    );
router
    .route('/createOffer')
    .post(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.LECTURER,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(offersController.createOffer)
    );
router
    .route('/introduceOrDecline/:offerId')
    .post(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.METHODIST,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(offersController.introducedOrDeclined)
    );
router
    .route('/confirmOrReject/:offerId')
    .post(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DEPUTY_DEPARTMENT_HEAD,
                role.UNIT_ADMIN,
                role.DIRECTORATE,
                role.DEPUTY_DIRECTORATE,
            ])
        ),
        asyncRoute(offersController.confirmOrReject)
    );
router
    .route('/delete/:offerId')
    .delete(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(offersController.deleteOffer)
    );
export default router;
