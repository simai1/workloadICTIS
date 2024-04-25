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

    async setAttaches({ body: { workloadId }, user }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');

        const educator = await Educator.findOne({ where: { userId: user } });

        const workload = await Workload.findOne({ where: { educatorId: educator.id, id: workloadId } });

        console.log(workload);

        const newAttach = await Attaches.create({
            educatorId: educator.userId,
            workloadId: workload.id,
            isAttach: true,
        });
        console.log(newAttach);
        const attachedDto = new AttachedDto(newAttach);
        res.json(attachedDto);
    },

    async unAttaches({ params: { attachesId } }, res) {
        if (!attachesId) throw new AppErrorMissing('attachedId');

        const attached = await Attaches.findByPk(attachesId);
        if (!attached) throw new AppErrorMissing('Attached not found');

        await attached.destroy({ force: true });
        res.json('Successfully deleted');
    },
};
