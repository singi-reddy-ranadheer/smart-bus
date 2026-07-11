import { TransportDataProvider } from './TransportDataProvider';
import { DemoTransportDataProvider } from './DemoTransportDataProvider';
import { ApiTransportDataProvider } from './ApiTransportDataProvider';

// For the v0.1 prototype, we use the Demo provider.
// This will be swapped out during backend integration.
export const dataProvider: TransportDataProvider = new DemoTransportDataProvider();

