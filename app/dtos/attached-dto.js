export default class AttachedDto {
    id;
    isAttach;
    educatorId;
    workloadId;

    constructor(model) {
        this.id = model.id;
        this.isAttach = model.isAttach;
        this.educatorId = model.educatorId;
        this.workloadId = model.workloadId;
    }
}
