import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Configuration for TypeORM with PostgreSQL
// This configuration will connect to a PostgreSQL database using the environment variables defined in the .env
export const typeOrmPostgresConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE') || false, // Set to true only in development
    logging: configService.get<boolean>('DATABASE_LOGGING') || false,
    autoLoadEntities: true,
    schema: 'public', // Default schema for PostgreSQL,
    namingStrategy: new SnakeNamingStrategy(), // Use snake_case for table and column names
  }),
};
