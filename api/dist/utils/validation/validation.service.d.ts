export declare class ValidationService {
    StatusWithCode: (code: number) => {
        code: number;
        message: string;
    };
    NullValidator: (data: any, condition?: string) => void;
}
