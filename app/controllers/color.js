import ColorDto from '../dtos/color-dto.js';
import Color from '../models/color.js';
import Educator from '../models/educator.js';
import Workload from '../models/workload.js';
import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';

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

    async changeColors({ params: { colorIds }, body: { color } }, res) {
        if (!colorIds || !Array.isArray(colorIds) || colorIds.length === 0) {
            throw new AppErrorMissing('colorIds');
        }
        if (!color) {
            throw new AppErrorMissing('color');
        }

        // Обновляем цвета по каждому идентификатору в массиве
        const updatedColors = [];
        for (const colorId of colorIds) {
            const existingColor = await Color.findByPk(colorId);
            if (!existingColor) {
                throw new AppErrorInvalid(`Color with ID ${colorId} not found`);
            }
            await existingColor.update({ color });
            updatedColors.push(new ColorDto(existingColor));
        }

        res.json(updatedColors);
    },
};
