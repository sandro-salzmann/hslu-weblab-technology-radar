import "dotenv/config";
import Joi from "joi";

interface EnvVarsSchema {
  PORT: number;
  PGHOST: string;
  PGUSER: string;
  PGDATABASE: string;
  PGPASSWORD: string;
  PGPORT: number;
  ALLOWED_CORS_ORIGIN: string;
}

const envVarsSchemaValidator = Joi.object<EnvVarsSchema>()
  .keys({
    PORT: Joi.number().less(65535).greater(1).required(),
    PGHOST: Joi.string().required(),
    PGUSER: Joi.string().required(),
    PGDATABASE: Joi.string().required(),
    PGPASSWORD: Joi.string().required(),
    PGPORT: Joi.number().less(65535).greater(1).required(),
    ALLOWED_CORS_ORIGIN: Joi.string().required(),
  })
  .unknown(true);

const { value: validEnvVars, error } = envVarsSchemaValidator.validate(
  process.env
);

if (error) {
  throw new Error(`Request validation error: ${error.message}`);
}

if (!validEnvVars) {
  throw new Error(`Config validation failed.`);
}

export const ENV = {
  port: validEnvVars.PORT,
  pgHost: validEnvVars.PGHOST,
  pgUser: validEnvVars.PGUSER,
  pgDatabase: validEnvVars.PGDATABASE,
  pgPassword: validEnvVars.PGPASSWORD,
  pgPort: validEnvVars.PGPORT,
  allowedCorsOrigin: validEnvVars.ALLOWED_CORS_ORIGIN,
};
