"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteFollower = void 0;
exports.calculateBearing = calculateBearing;
function calculateBearing(from, to) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;
    const dLng = toRad(to.lng - from.lng);
    const y = Math.sin(dLng) * Math.cos(toRad(to.lat));
    const x = Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
        Math.sin(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.cos(dLng);
    const bearing = toDeg(Math.atan2(y, x));
    return (bearing + 360) % 360;
}
class RouteFollower {
    constructor(route) {
        this.route = route;
        this.waypoints = route.waypoints;
        this.currentIndex = 0;
    }
    // Advance the bus by a fraction of total route (0.0 to 1.0 progress delta)
    advance(progressDelta) {
        const total = this.waypoints.length;
        let nextIndex = this.currentIndex + Math.max(1, Math.round(progressDelta * total));
        if (nextIndex >= total) {
            nextIndex = 0; // loop back
        }
        const from = this.waypoints[this.currentIndex];
        const to = this.waypoints[nextIndex];
        this.currentIndex = nextIndex;
        return {
            position: to,
            heading: calculateBearing(from, to),
        };
    }
    getProgress() {
        return this.currentIndex / this.waypoints.length;
    }
    reset() {
        this.currentIndex = 0;
    }
}
exports.RouteFollower = RouteFollower;
