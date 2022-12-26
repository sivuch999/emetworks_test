import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

console.log('process.env.NODE_ENV',process.env.NODE_ENV);

//   async function bootstrap() {  
//     const port = process.env.PORT || 8080;
//     const app = await NestFactory.create(AppModule, { bodyParser: true });
//     app.use(express.json({ limit: '50mb' }));
//     app.use(express.urlencoded({ extended: true, limit: '50mb' }));
//     app.enableCors();
//     await app.listen(port);
//   }
//   bootstrap();  

  const server: express.Express = express();
  export const createNestServer = async (expressInstance: express.Express) => {
    const adapter = new ExpressAdapter(expressInstance);
    const port = process.env.PORT || 8080;
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      adapter,
      { bodyParser: true },
    );
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.enableCors();
    return app.init();
  };
  createNestServer(server)
    .then((v) => console.log('Nest Ready'))
    .catch((error) => console.error('Nest broken', error));

   export const api: functions.HttpsFunction = functions
    // .runWith({ minInstances: 1 })
    .region('asia-southeast1')
    .https.onRequest(server);

