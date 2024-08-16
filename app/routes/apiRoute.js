import { asyncRoute } from "../utils/errors.js";
import eduController from "../controllers/educator.js";
import { Router } from "express";

const router = Router();

router.route('/getByEmail/:email').get(asyncRoute(eduController.getOneByEmail));
export default router;
