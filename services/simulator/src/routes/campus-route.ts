import { BaseRoute, Stop } from '../route-follower';

export class CampusRoute extends BaseRoute {
  id = 'campus-express';
  name = 'Campus Express';

  async load(): Promise<void> {
    this.stops = [
      {
        id: 'stop-1',
        name: 'Campus Gate',
        code: 'CE-101-01',
        latitude: 17.3850,
        longitude: 78.4867,
      },
      {
        id: 'stop-2',
        name: 'Library',
        code: 'CE-101-02',
        latitude: 17.3830,
        longitude: 78.4900,
      },
      {
        id: 'stop-3',
        name: 'Bus Stand',
        code: 'CE-101-03',
        latitude: 17.3790,
        longitude: 78.4950,
      },
      {
        id: 'stop-4',
        name: 'Railway Station',
        code: 'CE-101-04',
        latitude: 17.3750,
        longitude: 78.5000,
      },
      {
        id: 'stop-5',
        name: 'Airport',
        code: 'CE-101-05',
        latitude: 17.3710,
        longitude: 78.5090,
      },
    ];
  }
}