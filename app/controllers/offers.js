import Educator from '../models/educator.js';
import Offer from '../models/offers.js';
import WorkloadController from './workload.js';
import Workload from '../models/workload.js';
import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import User from '../models/user.js';
import EducatorDto from '../dtos/educator-dto.js';
import OfferDto from '../dtos/offer-dto.js';
import status from '../config/status.js';

export default {
    async getAllOffers(req, res) {
        try {
            // Получение всех предложений
            const offers = await Offer.findAll({
                include: { model: Educator },
                attributes: { exclude: ['EducatorId'] },
            });

            // Создание нового массива предложений с добавлением информации о преподавателе и инициаторе
            const offersWithDetails = await Promise.all(
                offers.map(async offer => {
                    const educator = await Educator.findByPk(offer.educatorId, { attributes: { exclude: ['id'] } });
                    const proposer = await Educator.findByPk(offer.proposerId, { attributes: { exclude: ['id'] } });

                    // Создаем DTO для предложения
                    const offerDto = new OfferDto(offer);

                    return {
                        message: 'Offer created successfully',
                        offer: {
                            ...offerDto,
                            educator: new EducatorDto(educator),
                            proposer: new EducatorDto(proposer),
                        },
                    };
                })
            );

            // Отправка массива предложений с информацией о преподавателе и инициаторе
            res.json(offersWithDetails);
        } catch (error) {
            console.error('Error fetching offers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async createOffer({ body: { educatorId, workloadId }, user }, res) {
        try {
            // Получение информации о преподавателе
            const educator = await Educator.findByPk(educatorId, { attributes: { exclude: ['id'] } });

            const proposer = await Educator.findOne({ where: { userId: user } });
            if (!educator) {
                throw new AppErrorMissing('Educator not found');
            }

            // Проверка наличия указанной нагрузки в таблице нагрузок
            const workload = await Workload.findByPk(workloadId);
            if (!workload) {
                throw new AppErrorMissing('Workload not found');
            }
            // Создание предложения с учетом ассоциации с Educator
            const offer = await Offer.create({ proposerId: proposer.id, educatorId, workloadId });

            const offerDto = new OfferDto(offer);

            // Включаем данные о преподавателе в JSON-ответе
            res.json({
                message: 'Offer created successfully',
                offer: {
                    ...offerDto,
                    educator: new EducatorDto(educator),
                    proposer: new EducatorDto(proposer),
                },
            });
        } catch (error) {
            console.error('Error creating offer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async confirmOrReject({ params: { offerId }, body: { status: newStatus } }, res) {
        try {
            const offer = await Offer.findByPk(offerId);
            if (!offer) throw new AppErrorMissing('Offer not found');

            if (!newStatus) throw new AppErrorMissing('status');

            // Сравниваем статусы из тела запроса с определенными статусами
            if (newStatus === status.accepted) {
                // Установка статуса предложения на "принято"
                await offer.update({ status: status.accepted });

                // Если статус "принято", обработаем предложение
                await WorkloadController.facultyEducator(
                    { body: { educatorId: offer.educatorId, workloadId: offer.workloadId } },
                    res
                );

                // Удаление предложения, если оно принято
                await offer.destroy({ force: true });

                // Отправка сообщения об успешном принятии предложения
            } else if (newStatus === status.reject) {
                // Установка статуса предложения на "отклонено"
                await offer.update({ status: status.reject });

                // Удаление предложения, если оно отклонено
                await offer.destroy({ force: true });

                // Отправка сообщения об успешном отклонении предложения
                res.send('Предложение отклонено');
            }

            res.end();
        } catch (error) {
            console.error('Error confirming or rejecting offer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
