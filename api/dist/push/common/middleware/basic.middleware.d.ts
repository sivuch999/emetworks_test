import { NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";
import { ValidationService as UtilsValidation } from "src/utils/validation/validation.service";
export declare class BasicMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly utilsValidation;
    constructor(configService: ConfigService, utilsValidation: UtilsValidation);
    use(req: Request, res: Response, next: NextFunction): void;
}
