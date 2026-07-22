"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRoute = void 0;
function interpolate(a, b, segments) {
    const points = [];
    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        points.push({
            lat: a.lat + (b.lat - a.lat) * t,
            lng: a.lng + (b.lng - a.lng) * t,
        });
    }
    return points;
}
const stops = [
    { lat: 12.965, lng: 77.59 }, // City Center
    { lat: 12.967, lng: 77.592 }, // Market
    { lat: 12.969, lng: 77.596 }, // Hospital
    { lat: 12.972, lng: 77.598 }, // University
    { lat: 12.968, lng: 77.602 }, // Tech Park
    { lat: 12.965, lng: 77.59 }, // Back to City Center (loop)
];
const waypoints = [stops[0]];
for (let i = 0; i < stops.length - 1; i++) {
    waypoints.push(...interpolate(stops[i], stops[i + 1], 8));
}
waypoints.push(stops[stops.length - 1]);
exports.cityRoute = {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    name: 'City Loop',
    color: '#7C3AED',
    stops: stops.slice(0, 5),
    waypoints,
    totalDistance: 15.0,
};
