import Educator from '../models/educator.js';
import EducatorDto from "../dtos/educatorDto.js";
import recomendHours from "../config/recomend-hours.js";

export default {
    async getAll(body, res) {
        // const educators = await Educator.findAll();
        // const educatorDtos = [];
        // for (const educator of educators) {
        //     const educatorDto = new EducatorDto(educator);
        //     educatorDtos.push(educatorDto);
        // }
        // res.json(educatorDtos);
        console.log(recomendHours);
    },
};
