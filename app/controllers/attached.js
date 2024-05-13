import Educator from '../models/educator.js';
import Workload from '../models/workload.js';
import { AppErrorMissing } from '../utils/errors.js';
import Attaches from '../models/attached.js';
import AttachedDto from '../dtos/attached-dto.js';

export default {
    async getAllAttaches(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({ where: { userId } });

        const attached = await Attaches.findAll({ where: { educatorId: educator.userId } });

        const attachedDto = attached.map(attached => new AttachedDto(attached));
        res.json(attachedDto);
    },

    async setAttaches({ body: { workloadIds }, user }, res) {
        if (!workloadIds || !Array.isArray(workloadIds) || workloadIds.length === 0) {
            throw new AppErrorMissing('workloadIds');
        }
        const educator = await Educator.findOne({ where: { userId: user } });
        const attachedDtos = [];

        for (const workloadId of workloadIds) {
            const workload = await Workload.findOne({ where: { id: workloadId } });
            if (!workload) throw new AppErrorMissing('Workload not found');
            const newAttach = await Attaches.create({
                educatorId: educator.userId,
                workloadId: workload.id,
                isAttach: true,
            });
            console.log(newAttach);

            const attachedDto = new AttachedDto(newAttach);
            attachedDtos.push(attachedDto);
        }

        res.json(attachedDtos);
    },

    async unAttaches({ body: { attachesIds } }, res) {
        if (!attachesIds || !Array.isArray(attachesIds) || attachesIds.length === 0) {
            throw new AppErrorMissing('workloadIds');
        }
        for (const attachesId of attachesIds) {
            const attached = await Attaches.findByPk(attachesId);
            if (!attached) throw new AppErrorMissing('Attached not found');

            await attached.destroy({ force: true });
        }
        res.json('Successfully deleted');
    },
};
