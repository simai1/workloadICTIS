import { map as colorMap } from '../config/color.js';

export default class ColorDto {
    id;
    color;
    educatorId;
    workloadId;

    constructor(model) {
        this.id = model.id;
        this.color = model.color;
        this.educatorId = model.educatorId;
        this.workloadId = model.workloadId;
    }
}
