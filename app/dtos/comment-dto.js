export default class CommentDto {
    id;
    text;
    workloadId;
    isChecked;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.workloadId = model.workloadId;
        this.isChecked = model.isChecked;
    }
}
