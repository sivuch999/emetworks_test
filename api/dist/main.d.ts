/// <reference types="express-serve-static-core" />
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
export declare const createNestServer: (expressInstance: express.Express) => Promise<NestExpressApplication>;
export declare const api: functions.HttpsFunction;
