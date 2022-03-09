import { Authorization } from "common";
import { Request, Response } from "express";
import Joi from "joi";
import { HttpResponse } from "../controllers";

export type ControllerFn = (
  httpRequest: any,
  authorization: Authorization
) => Promise<HttpResponse>;

export const makeExpressCallback =
  (controller: ControllerFn) => async (req: Request, res: Response) => {
    try {
      const authorizationString = req.get("Authorization");
      if (!authorizationString) {
        // Authorization should always be set by gateway
        throw new Error("Authorization header not set.");
      }
      const authorization = JSON.parse(authorizationString);

      // validate authorization
      const validator = Joi.object<Authorization>()
        .keys({
          accountId: Joi.string().uuid({ version: "uuidv4" }).required(),
          teamId: Joi.string().uuid({ version: "uuidv4" }).required(),
          teamRole: Joi.string().valid("MEMBER", "LEADER").required(),
        })
        .unknown(true);

      const { value: validatedAuthorization, error } =
        validator.validate(authorization);

      if (error) {
        throw new Error(`Request validation error: ${error.message}`);
      }
      if (!validatedAuthorization) {
        throw new Error("Authorisation validation failed.");
      }

      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
      const { headers, statusCode, body } = await controller(
        httpRequest,
        validatedAuthorization
      );
      if (headers) res.set(headers);
      res.type("json");
      res.status(statusCode).send(body);
    } catch (error) {
      res.status(500).send({ error: "An unkown error occurred." });
    }
  };
