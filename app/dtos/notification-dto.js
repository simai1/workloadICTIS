import EducatorDto from './educator-dto.js';

export default class NotificationDto {
    id;
    message;
    isChecked;
    educatorId;

    constructor(model) {
        this.id = model.id;
        this.message = model.message;
        this.isChecked = model.isChecked;
        this.educatorId = model.educatorId;
        this.educator = new EducatorDto(model.Educator);
    }
}
