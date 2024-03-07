import EducatorDto from "./educator-dto.js";
export default class CommentDto {
    id;
    text;
    educator;
    workloadId;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.educator = new EducatorDto(model.Educator);
        this.workloadId = model.workloadId;
    }
}
