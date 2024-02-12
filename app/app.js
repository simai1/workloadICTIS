import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import corsMiddleware from './middlewares/cors.js';

import dbUtils from './utils/db.js';
import testUtils from './utils/test-data.js';

import authRoute from './routes/auth.js';
import parserRoute from './routes/parser.js';
import eduRoute from './routes/educator.js';
import workloadRoute from './routes/workload.js';

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
app.use('/parser', parserRoute);
app.use('/workload', workloadRoute);
app.use('/auth', authRoute);

// app.use('/auth', authRoute);
console.log(`Node env: ${process.env.NODE_ENV}`);
app.listen(PORT, () => console.log(`Listen on :${PORT}`));
