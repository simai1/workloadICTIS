import cors from 'cors';

export default cors({
    credentials: true,
    // origin: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: '*',
    allowedHeaders: '*',
});
