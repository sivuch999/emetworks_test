import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {    
    return {
      type: 'mysql',
      host: configService.get('Database').host || 'localhost',
      port: configService.get('Database').port || 3306,
      username: configService.get('Database').username,
      password: configService.get('Database').password,
      database: configService.get('Database').name,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize:configService.get<boolean>('DB_SYNCHRONIZE') || false,
      logging: configService.get<LoggerOptions>('DB_LOGGING') || false
    };
  }
}

export const TypeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService]
};
