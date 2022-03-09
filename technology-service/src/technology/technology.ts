import {
  HistoryEvent,
  TechnologyCategory,
  TechnologyData,
  TechnologyMaturity,
} from "common";
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
  getChangedBy: () => string | undefined;
  getChangedAt: () => string | undefined;
  publish: () => void;
  hasChanged: (byAccountId: string) => void;
  setName: (name: string) => void;
  setCategory: (category: TechnologyCategory) => void;
  setDescription: (description: string) => void;
  setMaturity: (maturity: TechnologyMaturity) => void;
  setMaturityDescription: (maturityDescription: string) => void;
  getNewHistoryEvents: () => HistoryEvent[];
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
  changedBy?: string;
  changedAt?: string;
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
    changedBy,
    changedAt,
  }) => {
    let newHistoryEvents: HistoryEvent[] = [];
    const validateId = (id?: string) => {
      if (!id || !Id.isValidId(id)) {
        throw new Error("Technology must have a valid id.");
      }
      return id;
    };
    const validateTeamId = (teamId: string) => {
      if (!teamId || !Id.isValidId(teamId)) {
        throw new Error("Technology must have a valid team id.");
      }
      return teamId;
    };
    const validatePublished = (published: boolean) => {
      if (![true, false].includes(published)) {
        throw new Error("Technology must have a valid published status.");
      }
      return published;
    };
    const validatePublishedAt = (publishedAt?: string) => {
      if (publishedAt) {
        try {
          publishedAt = new Date(publishedAt).toISOString();
        } catch (error) {
          // publishedAt parsing failed
          throw new Error("PublishedAt is not a valid date string.");
        }
      }
      return publishedAt;
    };
    const validateCategory = (category: TechnologyCategory) => {
      if (
        !["techniques", "platforms", "tools", "languages"].includes(category)
      ) {
        throw new Error("Technology must have a valid category.");
      }
      return category;
    };
    const validateMaturity = (maturity?: TechnologyMaturity) => {
      if (published && !maturity) {
        throw new Error("Technology must have a valid maturity.");
      }
      if (
        maturity &&
        !["assess", "trial", "adopt", "hold"].includes(maturity)
      ) {
        throw new Error("Technology must have a valid maturity.");
      }
      return maturity;
    };
    const validateDescription = (description: string) => {
      if (!description) {
        throw new Error("Technology must have a description.");
      }
      description = sanitizeText(description);
      if (description.length < 1) {
        throw new Error("Description contains no usable text.");
      }
      return description;
    };
    const validateMaturityDescription = (maturityDescription?: string) => {
      if (published && !maturityDescription) {
        throw new Error("Technology must have a classification description.");
      }
      if (maturityDescription) {
        maturityDescription = sanitizeText(maturityDescription);
        if (maturityDescription.length < 1) {
          throw new Error(
            "Classification description contains no usable text."
          );
        }
      }
      return maturityDescription;
    };
    const validateChangedBy = (changedBy?: string) => {
      if (changedBy && !Id.isValidId(changedBy)) {
        throw new Error("Technology must have a valid changedBy.");
      }
      return changedBy;
    };
    const validateChangedAt = (changedAt?: string) => {
      if (changedAt) {
        try {
          changedAt = new Date(changedAt).toISOString();
        } catch (error) {
          // changedAt parsing failed
          throw new Error("changedAt is not a valid date string.");
        }
      }
      return changedAt;
    };
    const validateName = (name: string) => {
      if (!name) {
        throw new Error("Technology must have a name.");
      }
      name = sanitizeText(name);
      if (name.length < 1) {
        throw new Error("Name contains no usable text.");
      }
      return name;
    };

    id = validateId(id);
    teamId = validateTeamId(teamId);
    published = validatePublished(published);
    publishedAt = validatePublishedAt(publishedAt);
    category = validateCategory(category);
    maturity = validateMaturity(maturity);
    description = validateDescription(description);
    maturityDescription = validateMaturityDescription(maturityDescription);
    changedBy = validateChangedBy(changedBy);
    changedAt = validateChangedAt(changedAt);
    name = validateName(name);

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
      getChangedAt: () => changedAt,
      getChangedBy: () => changedBy,
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
        changedAt,
        changedBy,
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
        newHistoryEvents.push({ type: "published" });
      },
      setName: (newName: string) => {
        let prevName = name;
        name = validateName(newName);
        if (name !== prevName) {
          newHistoryEvents.push({
            type: "nameChanged",
            prevValue: prevName,
            newValue: name,
          });
        }
      },
      setDescription: (newDescription: string) => {
        let prevDescription = description;
        description = validateDescription(newDescription);
        if (description !== prevDescription) {
          newHistoryEvents.push({
            type: "descriptionChanged",
            prevValue: prevDescription,
            newValue: description,
          });
        }
      },
      setMaturityDescription: (newMaturityDescription: string) => {
        let prevMaturityDescription = maturityDescription;
        maturityDescription = validateMaturityDescription(
          newMaturityDescription
        );
        if (maturityDescription !== prevMaturityDescription) {
          newHistoryEvents.push({
            type: "maturityDescriptionChanged",
            prevValue: prevMaturityDescription,
            newValue: maturityDescription,
          });
        }
      },
      setCategory: (newCategory: TechnologyCategory) => {
        let prevCategory = category;
        category = validateCategory(newCategory);
        if (category !== prevCategory) {
          newHistoryEvents.push({
            type: "categoryChanged",
            prevValue: prevCategory,
            newValue: category,
          });
        }
      },
      setMaturity: (newMaturity: TechnologyMaturity) => {
        let prevMaturity = maturity;
        maturity = validateMaturity(newMaturity);
        if (maturity !== prevMaturity) {
          newHistoryEvents.push({
            type: "maturityChanged",
            prevValue: prevMaturity,
            newValue: maturity,
          });
        }
      },
      hasChanged: (byAccountId: string) => {
        changedBy = validateChangedBy(byAccountId);
        changedAt = new Date().toISOString();
      },
      getNewHistoryEvents: () => newHistoryEvents,
    });
  };
