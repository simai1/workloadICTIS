import {Router} from "express";
import multer from "multer";
import {asyncRoute} from "../utils/errors.js";
import parserController from '../controllers/parser.js';
import parser from "../controllers/parser.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ // multer settings
    storage: storage
});

router
    .route('/parseWorkload/:numberDepartment')
    .post(
        upload.single('file'),
        asyncRoute(parserController.parseWorkload)
    )
router
    .route('/parseEducators')
    .post(
        upload.single('file'),
        asyncRoute(parserController.parseEducators)
    )


export default router;