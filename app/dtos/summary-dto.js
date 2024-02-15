export default class SummaryDto {
    
    totalKafedralHours
    totalOIDHours
    totalHours
    constructor(model) {
        this.totalKafedralHours = model.totalKafedralHours;
        this.totalOIDHours = model.totalOIDHours
        this.totalHours = model.totalHours
    }
}