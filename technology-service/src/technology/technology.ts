import { TechnologyCategory, TechnologyData, TechnologyMaturity } from "common";
import { IdUtils } from "../Id";

export interface Technology {
  getTeamId: () => string;
  getPublished: () => boolean;
  getPublishedAt: () => string | undefined;
  getId: () => string;
  getCategory: () => TechnologyCategory;
  getMaturity: () => TechnologyMaturity | undefined;
  getName: () => string;
  getDescription: () => string;
  getMaturityDescription: () => string | undefined;
  getTechnologyData: () => TechnologyData;
  publish: () => void;
}

interface BuildMakeTechnologyFnProps {
  Id: IdUtils;
  sanitizeText: (text: string) => string;
}
export interface MakeTechnologyFnProps {
  teamId: string;
  id?: string;
  published?: boolean;
  publishedAt?: string;
  category: TechnologyCategory;
  maturity?: TechnologyMaturity;
  name: string;
  description: string;
  maturityDescription?: string;
}
type BuildMakeTechnologyFn = (
  props: BuildMakeTechnologyFnProps
) => MakeTechnologyFn;
type MakeTechnologyFn = (props: MakeTechnologyFnProps) => Technology;

export const buildMakeTechnology: BuildMakeTechnologyFn =
  ({ Id, sanitizeText }) =>
  ({
    id = Id.makeId(),
    teamId,
    published = false,
    publishedAt,
    category,
    maturity,
    name,
    description,
    maturityDescription,
  }) => {
    if (!id || !Id.isValidId(id)) {
      throw new Error("Technology must have a valid id.");
    }
    if (!teamId || !Id.isValidId(teamId)) {
      throw new Error("Technology must have a valid team id.");
    }
    if (!["techniques", "platforms", "tools", "languages"].includes(category)) {
      throw new Error("Technology must have a valid category.");
    }
    if (
      (maturity && !["assess", "trial", "adopt", "hold"].includes(maturity)) ||
      (published && !maturity)
    ) {
      throw new Error("Technology must have a valid maturity.");
    }
    if (![true, false].includes(published)) {
      throw new Error("Technology must have a valid published status.");
    }
    if (!name) {
      throw new Error("Technology must have a name.");
    }
    if (!description) {
      throw new Error("Technology must have a description.");
    }
    if (published && !maturityDescription) {
      throw new Error("Technology must have a classification description.");
    }
    if (publishedAt) {
      try {
        publishedAt = new Date(publishedAt).toISOString();
      } catch (error) {
        // publishedAt parsing failed
        throw new Error("PublishedAt is not a valid date string.");
      }
    }

    name = sanitizeText(name);
    if (name.length < 1) {
      throw new Error("Name contains no usable text.");
    }
    description = sanitizeText(description);
    if (description.length < 1) {
      throw new Error("Description contains no usable text.");
    }
    if (maturityDescription) {
      maturityDescription = sanitizeText(maturityDescription);
      if (maturityDescription.length < 1) {
        throw new Error("Classification description contains no usable text.");
      }
    }

    return Object.freeze({
      getId: () => id,
      getTeamId: () => teamId,
      getCategory: () => category,
      getMaturity: () => maturity,
      getPublished: () => published,
      getPublishedAt: () => publishedAt,
      getName: () => name,
      getDescription: () => description,
      getMaturityDescription: () => maturityDescription,
      getTechnologyData: () => ({
        id,
        category,
        maturity,
        teamId,
        published,
        publishedAt,
        name,
        description,
        maturityDescription,
      }),
      publish: () => {
        if (published) {
          throw new Error("Technology is already published");
        }
        if (!maturity) {
          throw new Error("Maturity needs to be set before publishing");
        }
        if (!maturityDescription) {
          throw new Error(
            "Maturity description needs to be set before publishing"
          );
        }

        published = true;
        publishedAt = new Date().toISOString();
      },
    });
  };
