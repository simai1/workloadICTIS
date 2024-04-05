import cors from 'cors';

export default cors({
    credentials: true,
    // origin: true,
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: '*',
    allowedHeaders: '*',
});
