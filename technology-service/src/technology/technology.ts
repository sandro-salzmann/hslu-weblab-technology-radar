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
    if (!Id.isValidId(id)) {
      throw new Error("Technology must have a valid id.");
    }
    if (!teamId || !Id.isValidId(teamId)) {
      throw new Error("Technology must have a valid team id.");
    }
    if (!["techniques", "platforms", "tools", "languages"].includes(category)) {
      throw new Error("Technology must have a valid category.");
    }
    if (maturity && !["assess", "trial", "adopt", "hold"].includes(maturity)) {
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
    if (!maturityDescription) {
      throw new Error("Technology must have a classification description.");
    }

    const sanitizedName = sanitizeText(name);
    if (sanitizedName.length < 1) {
      throw new Error("Name contains no usable text.");
    }
    const sanitizedDescription = sanitizeText(description);
    if (sanitizedDescription.length < 1) {
      throw new Error("Description contains no usable text.");
    }
    const sanitizedMaturityDescription = sanitizeText(maturityDescription);
    if (sanitizedMaturityDescription.length < 1) {
      throw new Error("Classification description contains no usable text.");
    }

    return Object.freeze({
      getId: () => id,
      getTeamId: () => teamId,
      getCategory: () => category,
      getMaturity: () => maturity,
      getPublished: () => published,
      getPublishedAt: () => publishedAt,
      getName: () => sanitizedName,
      getDescription: () => sanitizedDescription,
      getMaturityDescription: () => sanitizedMaturityDescription,
      getTechnologyData: () => ({
        id,
        category,
        maturity,
        teamId,
        published,
        publishedAt,
        name: sanitizedName,
        description: sanitizedDescription,
        maturityDescription: sanitizedMaturityDescription,
      }),
    });
  };
