import { NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";
import { ValidationService } from "src/utils/validation/validation.service";
import { HttpService } from "@nestjs/axios";
export declare class LineMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly httpService;
    private readonly validationService;
    constructor(configService: ConfigService, httpService: HttpService, validationService: ValidationService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
