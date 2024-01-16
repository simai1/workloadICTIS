import express from 'express';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middlewares/cors.js';
import dbUtils from './utils/db.js';
import testUtils from './utils/test-data.js';
import 'dotenv/config';

import eduRoute from './routes/educator.js';

const app = express();
const PORT = process.env.PORT || 3000;

(async function initDb() {
    try {
        await dbUtils.initializeDbModels();
        if (process.env.NODE_ENV === 'development') {
            await testUtils.fillWorkload();
            await testUtils.fillEducators();
        }
    } catch (e) {
        console.log(e);
        console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
        setTimeout(initDb, 5000);
    }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(corsMiddleware);

app.use('/educator', eduRoute);

console.log(`Node env: ${process.env.NODE_ENV}`);
app.listen(PORT, () => console.log(`Listen on :${PORT}`));
