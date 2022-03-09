import "dotenv/config";
import Joi from "joi";

interface EnvVarsSchema {
  PORT: number;
  HOST: string;
  TECHNOLOGY_SERVICE_URL: string;
  ACCOUNT_SERVICE_URL: string;
  ALLOWED_CORS_ORIGIN: string;
  AUTH_JWKS_URL: string;
  AUTH_JWT_ISSUER: string;
}

const envVarsSchemaValidator = Joi.object<EnvVarsSchema>()
  .keys({
    PORT: Joi.number().less(65535).greater(1).required(),
    HOST: Joi.string().required(),
    TECHNOLOGY_SERVICE_URL: Joi.string().required(),
    ACCOUNT_SERVICE_URL: Joi.string().required(),
    ALLOWED_CORS_ORIGIN: Joi.string().required(),
    AUTH_JWKS_URL: Joi.string().required(),
    AUTH_JWT_ISSUER: Joi.string().required(),
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
  host: validEnvVars.HOST,
  technologyServiceURL: validEnvVars.TECHNOLOGY_SERVICE_URL,
  accountServiceURL: validEnvVars.ACCOUNT_SERVICE_URL,
  allowedCorsOrigin: validEnvVars.ALLOWED_CORS_ORIGIN,
  authJwksUrl: validEnvVars.AUTH_JWKS_URL,
  authIssuer: validEnvVars.AUTH_JWT_ISSUER,
};
