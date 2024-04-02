import EducatorDto from './educator-dto.js';
export default class CommentDto {
    id;
    text;
    educator;
    isChecked;
    workloadId;
    sender;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.educator = model.Educator ? new EducatorDto(model.Educator) : null;
        this.isChecked = model.isChecked;
        this.workloadId = model.workloadId;
    }
}
