import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

// Validation schema for environment variables
// Adjust the schema according to your application's requirements
// This schema will validate the environment variables loaded from the .env file
// and ensure they meet the expected types and constraints.
const validationSchema: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
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
  envFilePath: 'env/.env',
  validationSchema,
  isGlobal: true,
};
