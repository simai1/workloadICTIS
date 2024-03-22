import Educator from '../models/educator.js';
import Offer from '../models/offers.js';
import WorkloadController from './workload.js';
import Workload from '../models/workload.js';
import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';

export default {
    async getAllOffers(req, res) {
        const offers = await Offer.findAll({ include: { model: Educator }, attributes: { exclude: ['EducatorId'] } });
        res.json(offers);
    },

    async createOffer({ body: { educatorId, workloadId } }, res) {
        try {
            // Получение информации о преподавателе
            const educator = await Educator.findByPk(educatorId);

            if (!educator) {
                throw new AppErrorMissing('Educator not found');
            }
            // Проверка наличия указанной нагрузки в таблице нагрузок
            const workload = await Workload.findByPk(workloadId);
            if (!workload) {
                throw new AppErrorMissing('Workload not found');
            }
            // Создание предложения с учетом ассоциации с Educator
            const offer = await Offer.create({ educatorId, workloadId });

            // Включаем данные о преподавателе в JSON-ответе
            res.json({
                message: 'Offer created successfully',
                offer: {
                    ...offer.toJSON(),
                    educator: educator.toJSON(), // Добавляем информацию о преподавателе
                },
            });
        } catch (error) {
            console.error('Error creating offer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async confirmOrReject({ params: { offerId }, body: { status } }, res) {
        try {
            const offer = await Offer.findByPk(offerId);
            if (!offer) throw new AppErrorMissing('Offer not found');

            if (!status) throw new AppErrorMissing('status');
            if (!['принято', 'отклонено'].includes(status)) throw new AppErrorInvalid('status');

            // Установка статуса предложения на основе значения из тела запроса
            offer.update({ status });

            // Если статус "принято", обработаем предложение
            if (status === 'принято') {
                await WorkloadController.facultyEducator(
                    { body: { educatorId: offer.educatorId, workloadId: offer.workloadId } },
                    res
                );
            } else if (status === 'отклонено') {
                // Удаление предложения, если оно отклонено
                await offer.destroy();
                res.send('Предложение отклонено');
            }

            res.end();
        } catch (error) {
            console.error('Error confirming or rejecting offer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
