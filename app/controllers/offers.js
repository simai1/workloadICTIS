import Educator from '../models/educator.js';
import Offer from '../models/offers.js';
import WorkloadController from './workload.js';
import Workload from '../models/workload.js';
import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import EducatorDto from '../dtos/educator-dto.js';
import OfferDto from '../dtos/offer-dto.js';
import status from '../config/status.js';
import jwt from '../utils/jwt.js';

export default {
    async getAllOffers(req, res) {
        try {
            // Получение всех предложений
            const offers = await Offer.findAll({
                include: { model: Educator },
                attributes: { exclude: ['EducatorId'] },
            });
            // Создание нового массива предложений с добавлением информации о преподавателе и инициаторе
            const offersWithDetails = [];
            for (const offer of offers) {
                const educator = await Educator.findByPk(offer.educatorId, { attributes: { exclude: ['id'] } });
                const proposer = await Educator.findByPk(offer.proposerId, { attributes: { exclude: ['id'] } });
                if (!educator || !proposer){
                    await offer.destroy();
                    continue;
                }
                // Создаем DTO для предложения
                const offerDto = new OfferDto(offer);
                // Добавляем информацию о преподавателе и инициаторе к объекту предложения
                offerDto.educator = new EducatorDto(educator);
                offerDto.proposer = new EducatorDto(proposer);

                // Добавляем предложение с информацией о преподавателе и инициаторе в массив
                offersWithDetails.push({
                    message: 'Offer created successfully',
                    offer: offerDto,
                });
            }

            // Отправка массива предложений с информацией о преподавателе и инициаторе
            res.json(offersWithDetails);
        } catch (error) {
            console.error('Error fetching offers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAllOffersByLecture(req, res) {
        try {
            const existUser = jwt.decode(req.cookies.refreshToken)
            const userId = existUser.id;
            const _educator = await Educator.findOne({
                where: {
                    userId: userId,
                },
            })
            // Получение всех предложений
            const offers = await Offer.findAll({
                include: { model: Educator },
                attributes: { exclude: ['EducatorId'] },
                educator: _educator.id,

            });
            // Создание нового массива предложений с добавлением информации о преподавателе и инициаторе
            const offersWithDetails = [];
            for (const offer of offers) {
                const educator = await Educator.findByPk(offer.educatorId, { attributes: { exclude: ['id'] } });
                const proposer = await Educator.findByPk(offer.proposerId, { attributes: { exclude: ['id'] } });

                // Создаем DTO для предложения
                const offerDto = new OfferDto(offer);
                // Добавляем информацию о преподавателе и инициаторе к объекту предложения
                offerDto.educator = new EducatorDto(educator);
                offerDto.proposer = new EducatorDto(proposer);

                // Добавляем предложение с информацией о преподавателе и инициаторе в массив
                offersWithDetails.push({
                    message: 'Offer created successfully',
                    offer: offerDto,
                });
            }

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
            const existUser = jwt.decode(req.cookies.refreshToken)
            const userId = existUser.id;
            const educator = await Educator.findByPk(educatorId, { attributes: { exclude: ['id'] } });

            const proposer = await Educator.findOne({ where: { userId: userId } });
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

    async introducedOrDeclined({ params: { offerId }, body: { status: newStatus } }, res) {
        try {
            const offer = await Offer.findByPk(offerId);
            if (!offer) throw new AppErrorMissing('Offer not found');
            if (!newStatus) throw new AppErrorMissing('status');

            // Проверка, что значение newStatus соответствует значениям из status.js
            if (!Object.values(status).includes(newStatus)) {
                throw new AppErrorInvalid('Invalid status');
            }
            if (newStatus !== status.introduced && newStatus !== status.decline) {
                throw new AppErrorInvalid('Invalid status, need introduced or decline');
            }

            await offer.update({ status: newStatus });
            if (newStatus === status.decline) {
                res.json({ message: 'Offer declined' });
            } else {
                res.json({ message: 'Offer introduced' });
            }
        } catch (error) {
            console.error('Error updating offer status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Финальная проверка предложения директором
    async confirmOrReject({ params: { offerId }, body: { status: newStatus } }, res) {
        const offer = await Offer.findByPk(offerId);
        if (!offer) throw new AppErrorMissing('Offer not found');

        if (!newStatus) throw new AppErrorMissing('status');

        // Проверка, что значение newStatus соответствует значениям из status.js
        if (!Object.values(status).includes(newStatus)) {
            throw new AppErrorInvalid('Invalid status');
        }
        if (newStatus !== status.confirmed && newStatus !== status.reject) {
            throw new AppErrorInvalid('Invalid status for introducedOrDeclined method');
        }

        // Сравниваем статусы из тела запроса с определенными статусами
        if (newStatus === status.confirmed) {
            await offer.update({ status: status.accepted });
            await WorkloadController.facultyEducator(
                { body: { educatorId: offer.educatorId, workloadIds: [offer.workloadId] } },
                res
            );
        } else if (newStatus === status.reject) {
            await offer.update({ status: status.reject });
            res.send('Offer rejected');
        }

        // Удаление предложения
        await offer.destroy({ force: true });
    },
    async deleteOffer({ params: { offerId } }, res) {
        if (!offerId) throw new AppErrorMissing('offerId');
        const offer = await Offer.findByPk(offerId);
        if (!offer) throw new AppErrorMissing('Offer not found');
        await offer.destroy({ force: true });
        res.status(200).json('Successfully delete');
    },
};
