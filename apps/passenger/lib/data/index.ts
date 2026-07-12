import { TransportDataProvider } from './TransportDataProvider';
import { ApiTransportDataProvider } from './ApiTransportDataProvider';
import { DemoTransportDataProvider } from './DemoTransportDataProvider';

// Real provider wired to the backend API
export const dataProvider: TransportDataProvider = new ApiTransportDataProvider();

// Keep the demo provider available for fallback or testing
export { DemoTransportDataProvider };