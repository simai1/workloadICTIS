import ColorDto from '../dtos/color-dto.js';
import Color from '../models/color.js';
import Educator from '../models/educator.js';
import Workload from '../models/workload.js';
import { AppErrorMissing } from '../utils/errors.js';

export default {
    async getAllColors(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({ where: { userId } });

        const colors = await Color.findAll({ where: { educatorId: educator.userId } });

        const colorsDto = colors.map(color => new ColorDto(color));
        res.json(colorsDto);
    },

    async setColor({ body: { color, workloadId }, user }, res) {
        if (!color) throw new AppErrorMissing('color');
        if (!workloadId) throw new AppErrorMissing('workloadId');

        const educator = await Educator.findOne({ where: { userId: user } });

        const workload = await Workload.findOne({ where: { educatorId: educator.id, id: workloadId } });

        const newColor = await Color.create({ color, educatorId: educator.userId, workloadId: workload.id });
        const colorDto = new ColorDto(newColor);
        res.json(colorDto);
    },

    async changeColor({ params: { colorId }, body: { color } }, res) {
        if (!colorId) throw new AppErrorMissing('colorId');
        if (!color) throw new AppErrorMissing('color');
        const newColor = await Color.findByPk(colorId);
        if (!color) throw new AppErrorMissing('color');
        await newColor.update({ color });
        const colorDto = new ColorDto(newColor);
        res.json(colorDto);
    },
};
