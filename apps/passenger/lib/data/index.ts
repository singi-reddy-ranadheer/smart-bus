import { TransportDataProvider } from './TransportDataProvider';
import { ApiTransportDataProvider } from './ApiTransportDataProvider';
import { DemoTransportDataProvider } from './DemoTransportDataProvider';

// Switch to real API provider so the app talks to the backend service.
export const dataProvider: TransportDataProvider = new ApiTransportDataProvider();

// Keep the demo provider available for fallback or testing
export { ApiTransportDataProvider, DemoTransportDataProvider };
