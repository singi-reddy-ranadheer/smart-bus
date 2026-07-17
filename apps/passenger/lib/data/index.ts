import { TransportDataProvider } from './TransportDataProvider';
import { DemoTransportDataProvider } from './DemoTransportDataProvider';

// Use the demo provider for local preview so the app renders without a backend service.
export const dataProvider: TransportDataProvider = new DemoTransportDataProvider();

// Keep the demo provider available for fallback or testing
export { DemoTransportDataProvider };