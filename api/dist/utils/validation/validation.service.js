"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const common_1 = require("@nestjs/common");
let ValidationService = class ValidationService {
    constructor() {
        this.StatusWithCode = (code) => {
            switch (code) {
                case 200:
                    return { code, message: 'ok' };
                case 400:
                    return { code, message: 'bad request' };
                case 401:
                    return { code, message: 'unauthorized' };
                case 404:
                    return { code, message: 'GetList' };
                default:
                    return { code, message: 'unknown' };
            }
        };
        this.NullValidator = (data, condition = 'full') => {
            Object.keys(data).map(v => { console.log(data[v]); console.log(Array.isArray(data[v])); });
            const validated = Object.keys(data)
                .filter((v) => data[v] == undefined || data[v] == null || (Array.isArray(data[v]) && data[v].length <= 0))
                .map((v) => v);
            console.log("validated", validated);
            switch (condition) {
                case 'either':
                    if (Object.keys(data).length == validated.length) {
                        throw `ERROR: either required variable [${validated
                            .join(',')
                            .replace(',', ' / ')}]`;
                    }
                    break;
                case 'only':
                    if (Object.keys(data).length - 1 != validated.length) {
                        throw `ERROR: only one required variable [${Object.keys(data)
                            .join(',')
                            .replace(',', ' / ')}]`;
                    }
                    break;
                default:
                    if (validated.length > 0) {
                        throw `ERROR: required variable [${validated
                            .join(',')
                            .replace(',', ' / ')}]`;
                    }
            }
        };
    }
};
ValidationService = __decorate([
    (0, common_1.Injectable)()
], ValidationService);
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map