import mongoose from 'mongoose';
import { BotState } from '@/interfaces/bot';
import { discord, twitch } from '../clients';

export const sleepTime = async (state: BotState) => {
  console.log('🦉 Little Owl: Preparing for sleep..');

  // stop all node-cron scheduled tasks
  state.timers.forEach(job => job.stop());
  console.log('🦉 Little Owl: Scheduled Tasks Stopped');

  // disconnect Discord.js client
  discord.destroy();
  console.log('🦉 Little Owl: Discord.js Disconnected');

  // disconnect TMI.js client
  if (twitch.readyState() === 'OPEN') {
    await twitch.disconnect();
    console.log('🦉 Little Owl: TMI.js Disconnected');
  }

  // disconnect MongoDB client
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log('🦉 Little Owl: Database Disconnected');
  }

  console.log('🦉 Little Owl: Good night!');
  process.exit(0);
};
