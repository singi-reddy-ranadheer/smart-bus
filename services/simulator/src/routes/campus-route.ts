import { RouteDefinition, Waypoint } from '../types';

// Generate interpolated waypoints between two points
function interpolate(a: Waypoint, b: Waypoint, segments: number): Waypoint[] {
  const points: Waypoint[] = [];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    points.push({
      lat: a.lat + (b.lat - a.lat) * t,
      lng: a.lng + (b.lng - a.lng) * t,
    });
  }
  return points;
}

const stops: Waypoint[] = [
  { lat: 12.9716, lng: 77.5946 }, // Campus Gate
  { lat: 12.974, lng: 77.595 }, // Library
  { lat: 12.975, lng: 77.6 }, // Bus Stand
  { lat: 12.978, lng: 77.61 }, // Railway Station
  { lat: 13.0, lng: 77.65 }, // Airport
];

// Build waypoints by interpolating 8 points between each consecutive stop
const waypoints: Waypoint[] = [stops[0]];
for (let i = 0; i < stops.length - 1; i++) {
  waypoints.push(...interpolate(stops[i], stops[i + 1], 8));
}
waypoints.push(stops[stops.length - 1]);

export const campusRoute: RouteDefinition = {
  id: 'a1b2c3d4-0001-4000-8000-000000000001',
  name: 'Campus Express',
  color: '#E4572E',
  stops,
  waypoints,
  totalDistance: 12.5,
};