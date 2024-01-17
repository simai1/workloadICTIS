import recomendHours from '../config/recomend-hours.js';
import { map as mapPosition } from '../config/position.js';

export function setHours(educator) {
    const rate = educator.get('rate');
    const position = mapPosition[educator.get('position')];
    educator.set('maxHours', rate * 900);
    educator.set('recommendedMaxHours', recomendHours[position].max * rate);
    educator.set('minHours', recomendHours[position].min * rate);
}
