export default class SummaryDto {
    kafedralAutumnWorkload
    kafedralSpringWorkload
    kafedralAdditionalWorkload
    instituteAutumnWorkload
    instituteSpringWorkload
    instituteManagementWorkload
    totalKafedralHours
    totalOidHours
    totalHours
    constructor(model) {
        this.kafedralAutumnWorkload = model.kafedralAutumnWorkload
        this.kafedralSpringWorkload = model.kafedralSpringWorkload
        this.kafedralAdditionalWorkload = model.kafedralAdditionalWorkload
        this.instituteAutumnWorkload = model.instituteAutumnWorkload
        this.instituteSpringWorkload = model.instituteSpringWorkload
        this.instituteManagementWorkload = model.instituteManagementWorkload
        this.totalKafedralHours = model.totalKafedralHours;
        this.totalOidHours = model.totalOidHours
        this.totalHours = model.totalHours
    }
}