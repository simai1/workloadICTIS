import Educator from '../models/educator.js';

export default {
    async getAll(body, res) {
        const educators = await Educator.findAll();
        res.json(educators);
    },
};
