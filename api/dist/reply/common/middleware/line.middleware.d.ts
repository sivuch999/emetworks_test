import { NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";
import { ValidationService } from "src/utils/validation/validation.service";
export declare class LineMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly validationService;
    constructor(configService: ConfigService, validationService: ValidationService);
    use(req: Request, res: Response, next: NextFunction): Promise<{
        status: {
            code: number;
            message: string;
        };
        error: any;
    }>;
}
