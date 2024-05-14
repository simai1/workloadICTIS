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

    async setColor({ body: { color, workloadIds }, user }, res) {
        if (!color) throw new AppErrorMissing('color');
        if (!workloadIds || !Array.isArray(workloadIds) || workloadIds.length === 0) {
            throw new AppErrorMissing('workloadIds');
        }

        const educator = await Educator.findOne({ where: { userId: user } });

        const workloadColor = { color, educatorId: educator.userId };

        const colors = [];
        for (const workloadId of workloadIds) {
            const workload = await Workload.findOne({ where: { id: workloadId } });

            // Используем общий цвет для всех нагрузок
            const newColor = await Color.create({ ...workloadColor, workloadId: workload.id });
            const colorDto = new ColorDto(newColor);
            colors.push(colorDto);
        }
        res.json(colors);
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
