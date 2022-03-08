import Joi from "joi";
import { ControllerFn } from "../express-callback";
import { ListTechnologyHistoryFn } from "../use-cases/list-technology-history";

export interface GetTechnologyHistoryParams {
  technologyId: string;
}

type MakeGetTechnologyHistoryFn = ({
  listTechnologyHistory,
}: {
  listTechnologyHistory: ListTechnologyHistoryFn;
}) => ControllerFn;

export const makeGetTechnologyHistory: MakeGetTechnologyHistoryFn =
  ({ listTechnologyHistory }) =>
  async (httpRequest, authorization) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // validate params
      const validator = Joi.object<GetTechnologyHistoryParams>().keys({
        technologyId: Joi.string().uuid({ version: "uuidv4" }).required(),
      });

      const { value: validatedParams, error } = validator.validate(
        httpRequest.params
      );

      if (error) {
        throw new Error(`Config validation error: ${error.message}`);
      }
      if (!validatedParams) {
        throw new Error("Validation failed.");
      }

      const history = await listTechnologyHistory({
        teamId: authorization.teamId,
        technologyId: validatedParams.technologyId,
      });
      return {
        headers,
        statusCode: 200,
        body: history,
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
