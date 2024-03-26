import { map as statusMap } from '../config/status.js';
export default class OfferDto {
    id;
    status;
    educatorId;
    workloadId;
    educator;
    proposer;

    constructor(model) {
        this.id = model.id;
        this.status = statusMap[model.statusMap];
        this.educatorId = model.educatorId;
        this.workloadId = model.workloadId;
        this.educator = model.educator;
        this.proposer = model.proposer;
    }
}
