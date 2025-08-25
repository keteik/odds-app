import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvSchema } from './env.config';

// Configuration for TypeORM with PostgreSQL
// This configuration will connect to a PostgreSQL database using the environment variables defined in the .env
export const typeOrmPostgresConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvSchema, true>): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    synchronize: configService.get('DATABASE_SYNCHRONIZE') || false, // Set to true only in development
    logging: configService.get('DATABASE_LOGGING') || false,
    autoLoadEntities: true,
    schema: 'public', // Default schema for PostgreSQL,
    namingStrategy: new SnakeNamingStrategy(), // Use snake_case for table and column names
  }),
};
