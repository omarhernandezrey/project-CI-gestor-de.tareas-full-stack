import app from './app';
import { initDB } from './db/connection';

async function start() {
  let intentos = 10;
  while (intentos > 0) {
    try {
      await initDB();
      break;
    } catch {
      intentos--;
      console.log(`⏳ Esperando base de datos... ${intentos} intentos`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(3000, () => console.log('🚀 API corriendo en http://localhost:3000'));
}

start();
