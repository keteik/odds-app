import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

// Environment variables schema
// This schema defines the expected structure of environment variables
// and will be used to validate the loaded configuration.
export type EnvSchema = {
  APP_PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_LOGGING: boolean;
  DATABASE_SYNCHRONIZE: boolean;
  THE_ODDS_API_BASE_URL: string;
  THE_ODDS_API_KEY: string;
  THE_ODDS_API_SPORT_KEY: string;
  THE_ODDS_API_REGIONS: string;
  GOOGLE_SHEETS_CLIENT_ID: string;
  GOOGLE_SHEETS_CLIENT_SECRET: string;
  GOOGLE_SHEETS_SHEET_URL: string;
  GOOGLE_SHEETS_SHEET_ID: string;
  GOOGLE_SHEETS_SHEET_NAME: string;
  GOOGLE_SHEETS_ACCESS_TOKEN: string;
  GOOGLE_SHEETS_REFRESH_TOKEN: string;
};

// Validation schema for environment variables
// Adjust the schema according to your application's requirements
// This schema will validate the environment variables loaded from the .env file
// and ensure they meet the expected types and constraints.
const envValidationSchema: Joi.ObjectSchema<EnvSchema> = Joi.object<EnvSchema>({
  APP_PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  THE_ODDS_API_BASE_URL: Joi.string().uri().required(),
  THE_ODDS_API_KEY: Joi.string().required(),
  THE_ODDS_API_SPORT_KEY: Joi.string().required(),
  THE_ODDS_API_REGIONS: Joi.string().required(),
  GOOGLE_SHEETS_CLIENT_ID: Joi.string().required(),
  GOOGLE_SHEETS_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_SHEETS_SHEET_URL: Joi.string().uri().required(),
  GOOGLE_SHEETS_SHEET_ID: Joi.string().required(),
  GOOGLE_SHEETS_SHEET_NAME: Joi.string().required(),
  GOOGLE_SHEETS_ACCESS_TOKEN: Joi.string().required(),
  GOOGLE_SHEETS_REFRESH_TOKEN: Joi.string().required(),
});

// Configuration for the ConfigModule
// This configuration will load environment variables from the specified .env file
export const envConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  validationSchema: envValidationSchema,
  isGlobal: true,
};
