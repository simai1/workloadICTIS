import EducatorDto from './educator-dto.js';
export default class CommentDto {
    id;
    text;
    educator;
    isChecked;
    workloadId;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.educator = new EducatorDto(model.Educator);
        this.isChecked = model.isChecked;
        this.workloadId = model.workloadId;
    }
}
