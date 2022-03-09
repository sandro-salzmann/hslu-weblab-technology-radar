import {
  TechnologyCategory,
  TechnologyMaturity,
  TechnologyPreviewData,
} from "common";
import { IdUtils } from "../Id";

export interface TechnologyPreview {
  getId: () => string;
  getCategory: () => TechnologyCategory;
  getMaturity: () => TechnologyMaturity;
  getPublished: () => boolean;
  getName: () => string;
  getDescriptionPreview: () => string;
  getTechnologyPreviewData: () => TechnologyPreviewData;
}

interface BuildMakeTechnologyPreviewFnProps {
  Id: IdUtils;
  sanitizeText: (text: string) => string;
}
export interface MakeTechnologyPreviewFnProps {
  id: string;
  category: TechnologyCategory;
  maturity: TechnologyMaturity;
  published?: boolean;
  name: string;
  descriptionPreview: string;
}
type BuildMakeTechnologyPreviewFn = (
  props: BuildMakeTechnologyPreviewFnProps
) => MakeTechnologyFn;
type MakeTechnologyFn = (
  props: MakeTechnologyPreviewFnProps
) => TechnologyPreview;

export const buildMakeTechnologyPreview: BuildMakeTechnologyPreviewFn =
  ({ Id, sanitizeText }) =>
  ({ id, category, maturity, name, descriptionPreview, published = false }) => {
    if (!id || !Id.isValidId(id)) {
      throw new Error("Technology preview must have a valid id.");
    }
    if (!["techniques", "platforms", "tools", "languages"].includes(category)) {
      throw new Error("Technology preview must have a valid category.");
    }
    if (maturity && !["assess", "trial", "adopt", "hold"].includes(maturity)) {
      throw new Error("Technology preview must have a valid maturity.");
    }
    if (![true, false].includes(published)) {
      throw new Error("Technology preview must have a valid published status.");
    }
    if (!name) {
      throw new Error("Technology preview must have a name.");
    }
    if (!descriptionPreview) {
      throw new Error("Technology preview must have a description.");
    }

    const sanitizedName = sanitizeText(name);
    if (sanitizedName.length < 1) {
      throw new Error("Name contains no usable text.");
    }
    const sanitizedDescriptionPreview = sanitizeText(descriptionPreview);
    if (sanitizedDescriptionPreview.length < 1) {
      throw new Error("Description preview contains no usable text.");
    }

    return Object.freeze({
      getId: () => id,
      getCategory: () => category,
      getMaturity: () => maturity,
      getName: () => sanitizedName,
      getPublished: () => published,
      getDescriptionPreview: () => sanitizedDescriptionPreview,
      getTechnologyPreviewData: () => ({
        id,
        category,
        maturity,
        published,
        name: sanitizedName,
        descriptionPreview: sanitizedDescriptionPreview,
      }),
    });
  };
