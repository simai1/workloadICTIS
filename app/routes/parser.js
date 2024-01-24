import {Router} from "express";
import multer from "multer";
import {asyncRoute} from "../utils/errors.js";
import parserController from '../controllers/parser.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

const upload = multer({ // multer settings
    storage: storage
});
// fixme: привести к человеческому виду
router.post('/xlsx', upload.single('file'), function (req, res) {
    const fileLocation = req.file.path;
    console.log(fileLocation);
    asyncRoute(parserController.parseFromXlsx(fileLocation, res));
});


export default router;