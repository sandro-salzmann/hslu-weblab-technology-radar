import { PatchTechnologyBody } from "common";
import Joi from "joi";
import { ControllerFn } from "../express-callback";
import { EditTechnologyFn } from "../use-cases/edit-technology";

export const makePatchTechnology =
  ({ editTechnology }: { editTechnology: EditTechnologyFn }): ControllerFn =>
  async (httpRequest, authorization) => {
    const headers = { "Content-Type": "application/json" };

    try {
      const validator = Joi.object<PatchTechnologyBody>().keys({
        id: Joi.string().uuid({ version: "uuidv4" }).required(),
        name: Joi.string().optional(),
        category: Joi.string().optional(),
        description: Joi.string().optional(),
        maturity: Joi.string().optional(),
        maturityDescription: Joi.string().optional(),
        published: Joi.boolean().optional(),
      });

      const { value: validatedBody, error } = validator.validate(
        httpRequest.body
      );

      if (error) throw new Error(`Config validation error: ${error.message}`);
      if (!validatedBody) throw new Error("Validation failed.");

      const updatedTechnology = await editTechnology(
        {
          teamId: authorization.teamId,
          ...validatedBody,
        },
        authorization.accountId,
        authorization.teamRole
      );
      return {
        headers,
        statusCode: 200,
        body: updatedTechnology.getTechnologyData(),
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
