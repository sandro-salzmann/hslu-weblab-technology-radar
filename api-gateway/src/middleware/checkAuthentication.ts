import { ENV } from "../config/config";

var jwt = require("express-jwt");
var jwks = require("jwks-rsa");

export const checkAuthentication = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 30,
    jwksUri: ENV.authJwksUrl,
  }),
  audience: `http://${ENV.host}:${ENV.port}`,
  issuer: ENV.authIssuer,
  algorithms: ["RS256"],
});
