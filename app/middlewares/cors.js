import cors from 'cors';

export default cors({
    credentials: true,
    // origin: true, //НА ПРОДЕ ПОТОМ УБРАТЬ ORIGIN: '*'
    origin: '*',
    exposedHeaders: '*',
    allowedHeaders: '*',
    transport: ['websocket'],
});
