import { createConnection } from 'typeorm';

import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';

import { Server } from './Server';

async function bootstrap() {
  createConnection()
    .then(async (connection) => {})
    .catch((error) => console.log(error));

  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
