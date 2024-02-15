export default class HoursDto {
    kafedralAutumnWorkload;
    kafedralSpringWorkload;
    kafedralAdditionalWorkload;
    instituteAutumnWorkload;
    instituteSpringWorkload;
    instituteManagementWorkload;

    constructor(model) {
        this.kafedralAutumnWorkload = model.kafedralAutumnWorkload;
        this.kafedralSpringWorkload = model.kafedralSpringWorkload;
        this.kafedralAdditionalWorkload = model.kafedralAdditionalWorkload;
        this.instituteAutumnWorkload = model.instituteAutumnWorkload;
        this.instituteSpringWorkload = model.instituteSpringWorkload;
        this.instituteManagementWorkload = model.instituteManagementWorkload;
    }
}