import Educator from '../models/educator.js';
import EducatorDto from '../dtos/educator-dto.js';
import { AppErrorAlreadyExists, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import { map as mapPositions} from '../config/position.js';
import { map as mapTypeOfEmployments } from '../config/type-of-employment.js';

export default {
    async getAll(params, res) {
        const educators = await Educator.findAll();
        const educatorDtos = [];
        for (const educator of educators) {
            const educatorDto = new EducatorDto(educator);
            educatorDtos.push(educatorDto);
        }
        res.json(educatorDtos);
    },
    async getOne({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findByPk(educatorId);
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorDto = new EducatorDto(educator);
        res.json(educatorDto);
    },
    
    //Обновляем данные преподователя
    async update({ params: { educatorId }, body: { name, position, typeOfEmployment, rate } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findByPk(educatorId);
        if (!educator) throw new AppErrorNotExist('educator');

        if (!name && !position && !typeOfEmployment && !rate) throw new AppErrorMissing('body');
        if (!name) name = educator.name;
        if (!position) position = educator.position;
        if (!typeOfEmployment) typeOfEmployment = educator.typeOfEmployment;
        if (!rate) rate = educator.rate;

        await educator.update({
            name,
            position,
            typeOfEmployment,
            rate,
        });

        res.json({ status: 'OK' });
    },
    //Создаем преподователя
    async create({ body: { name, position, typeOfEmployment, rate } }, res) {
        if (!name) throw new AppErrorMissing('name');
        if (!position) throw new AppErrorMissing('position');
        if (!typeOfEmployment) throw new AppErrorMissing('typeOfEmployment');
        if (!rate) throw new AppErrorMissing('rate');
        const checkEducator = await Educator.findOne({ where: { name } });
        if (checkEducator) throw new AppErrorAlreadyExists('educator');

        const educator = await Educator.create({
            name,
            position,
            typeOfEmployment,
            rate,
        });
        const educatorDto = new EducatorDto(educator);
        res.json(educatorDto);
    },
    async getPositions(params, res) {
        res.json(mapPositions);
    },
    async getTypeOfEmployments(params, res) {
        res.json(mapTypeOfEmployments);
    },

    async deleteEducator({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');

        const educator = await Educator.findByPk(educatorId);

        if (!educator) {
            return res.status(404).json('Educator not found');
        }

        await educator.destroy({force: true});

        res.status(200).json('Successfully deleted');
    }
};
