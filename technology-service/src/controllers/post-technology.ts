import { PostTechnologyBody } from "common";
import Joi from "joi";
import { ControllerFn } from "../express-callback";
import { AddTechnologyFn } from "../use-cases/add-technology";

export const makePostTechnology =
  ({ addTechnology }: { addTechnology: AddTechnologyFn }): ControllerFn =>
  async (httpRequest, authorization) => {
    const headers = { "Content-Type": "application/json" };

    try {
      const validator = Joi.object<PostTechnologyBody>().keys({
        name: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required(),
        maturity: Joi.string().optional(),
        maturityDescription: Joi.string().optional(),
      });

      const { value: validatedBody, error } = validator.validate(
        httpRequest.body
      );

      if (error) throw new Error(`Config validation error: ${error.message}`);
      if (!validatedBody) throw new Error("Validation failed.");

      const { id } = await addTechnology({
        teamId: authorization.teamId,
        ...validatedBody,
      }, authorization.accountId);
      return {
        headers,
        statusCode: 201,
        body: { id },
      };
    } catch (e: any) {
      // TODO: error handling
      return {
        headers,
        statusCode: 400,
        body: { error: e?.message },
      };
    }
  };
