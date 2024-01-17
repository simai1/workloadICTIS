import recommendHours from '../config/recommend-hours.js';
import { map as mapPosition } from '../config/position.js';

export function setHours(educator) {
    const rate = educator.get('rate');
    const position = mapPosition[educator.get('position')];
    educator.set('maxHours', rate * 900);
    educator.set('recommendedMaxHours', recommendHours[position].max * rate);
    educator.set('minHours', recommendHours[position].min * rate);
}
