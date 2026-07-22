export interface Stop {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
}

export abstract class BaseRoute implements Route {
  id!: string;
  name!: string;
  stops: Stop[] = [];

  abstract load(): Promise<void>;

  async initialize(): Promise<void> {
    await this.load();
  }
}