import { TechnologyCategory } from "common";
import Joi from "joi";
import { ControllerFn } from "../express-callback";
import { PreviewTechnologiesFn } from "../use-cases/preview-technologies";

type MakeGetTechnologiesPreviewFn = ({
  previewTechnologies,
}: {
  previewTechnologies: PreviewTechnologiesFn;
}) => ControllerFn;

export interface GetTechnologiesPreviewQuery {
  category: TechnologyCategory;
}

export const makeGetTechnologiesPreview: MakeGetTechnologiesPreviewFn =
  ({ previewTechnologies }) =>
  async (httpRequest, authorization) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // validate query
      const validator = Joi.object<GetTechnologiesPreviewQuery>()
        .keys({
          category: Joi.string()
            .valid("techniques", "platforms", "tools", "languages")
            .optional(),
        })
        .unknown(true);

      const { value: validatedQuery, error } = validator.validate(
        httpRequest.query
      );

      if (error) {
        throw new Error(`Config validation error: ${error.message}`);
      }
      if (!validatedQuery) {
        throw new Error("Validation failed.");
      }

      const technologiesPreview = await previewTechnologies({
        teamId: authorization.teamId,
        category: validatedQuery.category,
      });
      return {
        headers,
        statusCode: 200,
        body: technologiesPreview,
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
