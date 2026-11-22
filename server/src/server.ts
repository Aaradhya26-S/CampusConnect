import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { initDatabase } from './services/db.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  console.log('🚀 Starting Campus Connect Backend Server...');
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🎓 Campus Connect API Server is running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
