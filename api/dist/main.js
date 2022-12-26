"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.createNestServer = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const functions = require("firebase-functions");
const server = express();
const createNestServer = async (expressInstance) => {
    const adapter = new platform_express_1.ExpressAdapter(expressInstance);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, { bodyParser: true });
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.enableCors();
    return app.init();
};
exports.createNestServer = createNestServer;
(0, exports.createNestServer)(server)
    .then((v) => console.log('Nest Ready'))
    .catch((error) => console.error('Nest broken', error));
exports.api = functions
    .region('asia-southeast1')
    .https.onRequest(server);
//# sourceMappingURL=main.js.map