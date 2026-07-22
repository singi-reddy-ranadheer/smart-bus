import dotenv from 'dotenv';
import { BusManager } from './bus-manager';

dotenv.config();

const manager = new BusManager();

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down simulator...');
  await manager.stop();
  process.exit(0);
});

manager.start().catch((err) => {
  console.error('Failed to start simulator:', err);
  process.exit(1);
});