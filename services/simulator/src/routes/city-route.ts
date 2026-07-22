import { BaseRoute, Stop } from '../route-follower';

export class CityRoute extends BaseRoute {
  id = 'city-loop';
  name = 'City Loop';

  async load(): Promise<void> {
    this.stops = [
      {
        id: 'stop-1',
        name: 'City Center',
        code: 'CL-201-01',
        latitude: 17.3850,
        longitude: 78.4867,
      },
      {
        id: 'stop-2',
        name: 'Market',
        code: 'CL-201-02',
        latitude: 17.3820,
        longitude: 78.4840,
      },
      {
        id: 'stop-3',
        name: 'Hospital',
        code: 'CL-201-03',
        latitude: 17.3800,
        longitude: 78.4810,
      },
      {
        id: 'stop-4',
        name: 'University',
        code: 'CL-201-04',
        latitude: 17.3830,
        longitude: 78.4780,
      },
      {
        id: 'stop-5',
        name: 'Tech Park',
        code: 'CL-201-05',
        latitude: 17.3870,
        longitude: 78.4820,
      },
    ];
  }
}