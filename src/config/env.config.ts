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
});

// Configuration for the ConfigModule
// This configuration will load environment variables from the specified .env file
export const envConfig: ConfigModuleOptions = {
  envFilePath: 'env/.env',
  validationSchema,
  isGlobal: true,
};
