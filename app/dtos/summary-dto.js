export default class SummaryDto {
    
    totalKafedralHours
    totalOidHours
    totalHours
    constructor(model) {
        this.totalKafedralHours = model.totalKafedralHours;
        this.totalOidHours = model.totalOidHours
        this.totalHours = model.totalHours
    }
}