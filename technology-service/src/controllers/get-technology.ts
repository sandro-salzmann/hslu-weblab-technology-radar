import Joi from "joi";
import { ControllerFn } from "../express-callback";
import { ListTechnologyFn } from "../use-cases/list-technology";

export interface GetTechnologyParams {
  id: string;
}

type MakeGetTechnologyFn = ({
  listTechnology,
}: {
  listTechnology: ListTechnologyFn;
}) => ControllerFn;

export const makeGetTechnology: MakeGetTechnologyFn =
  ({ listTechnology }) =>
  async (httpRequest, authorization) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // validate params
      const validator = Joi.object<GetTechnologyParams>()
        .keys({
          id: Joi.string().uuid({ version: "uuidv4" }).required(),
        })
        .unknown(true);

      const { value: validatedParams, error } = validator.validate(
        httpRequest.params
      );

      if (error) {
        throw new Error(`Config validation error: ${error.message}`);
      }
      if (!validatedParams) {
        throw new Error("Validation failed.");
      }

      const technology = await listTechnology({
        teamId: authorization.teamId,
        teamRole: authorization.teamRole,
        technologyId: validatedParams.id,
      });
      return {
        headers,
        statusCode: 200,
        body: technology,
      };
    } catch (e: any) {
      // TODO: error handling
      return {
        headers,
        statusCode: 400,
        body: {
          error: e?.message,
        },
      };
    }
  };
