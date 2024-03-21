import { Router } from 'express';
import offersController from '../controllers/offers.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/').get(asyncRoute(offersController.getAllOffers));
router.route('/createOffer').post(asyncRoute(offersController.createOffer));
router.route('/confirmOrReject/:offerId').post(asyncRoute(offersController.confirmOrReject));
export default router;
