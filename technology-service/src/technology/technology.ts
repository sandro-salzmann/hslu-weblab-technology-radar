import { TechnologyCategory, TechnologyData, TechnologyMaturity } from "common";
import { IdUtils } from "../Id";

export interface Technology {
  getId: () => string;
  getCategory: () => TechnologyCategory;
  getMaturity: () => TechnologyMaturity;
  getName: () => string;
  getDescription: () => string;
  getDescriptionClassification: () => string;
  getTechnologyData: () => TechnologyData;
}

interface BuildMakeTechnologyFnProps {
  Id: IdUtils;
  sanitizeText: (text: string) => string;
}
export interface MakeTechnologyFnProps {
  id: string;
  category: TechnologyCategory;
  maturity: TechnologyMaturity;
  name: string;
  description: string;
  descriptionClassification: string;
}
type BuildMakeTechnologyFn = (
  props: BuildMakeTechnologyFnProps
) => MakeTechnologyFn;
type MakeTechnologyFn = (props: MakeTechnologyFnProps) => Technology;

export const buildMakeTechnology: BuildMakeTechnologyFn =
  ({ Id, sanitizeText }) =>
  ({
    id,
    category,
    maturity,
    name,
    description,
    descriptionClassification,
  }) => {
    if (!id || !Id.isValidId(id)) {
      throw new Error("Technology must have a valid id.");
    }
    if (!["techniques", "platforms", "tools", "languages"].includes(category)) {
      throw new Error("Technology must have a valid category.");
    }
    if (!["assess", "trial", "adopt", "hold"].includes(maturity)) {
      throw new Error("Technology must have a valid maturity.");
    }
    if (!name) {
      throw new Error("Technology must have a name.");
    }
    if (!description) {
      throw new Error("Technology must have a description.");
    }
    if (!descriptionClassification) {
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
    const sanitizedDescriptionClassification = sanitizeText(
      descriptionClassification
    );
    if (sanitizedDescriptionClassification.length < 1) {
      throw new Error("Classification description contains no usable text.");
    }

    return Object.freeze({
      getId: () => id,
      getCategory: () => category,
      getMaturity: () => maturity,
      getName: () => sanitizedName,
      getDescription: () => sanitizedDescription,
      getDescriptionClassification: () => sanitizedDescriptionClassification,
      getTechnologyData: () => ({
        id,
        category,
        maturity,
        name: sanitizedName,
        description: sanitizedDescription,
        descriptionClassification: sanitizedDescriptionClassification,
      }),
    });
  };
