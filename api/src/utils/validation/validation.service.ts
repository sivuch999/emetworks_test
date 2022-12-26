import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
  public StatusWithCode = (code: number) => {
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

  public NullValidator = (data: any, condition = 'full') => {
    Object.keys(data).map(v => { console.log(data[v]); console.log(Array.isArray(data[v])) })
    
    const validated = Object.keys(data)
      .filter((v: any) => data[v] == undefined || data[v] == null || (Array.isArray(data[v]) && data[v].length <= 0))
      .map((v: any) => v);
      console.log("validated",validated);
      
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
