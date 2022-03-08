import { TechnologyCategory, TechnologyMaturity } from "../technology";

export interface PostTechnologyBody {
  name: string;
  category: TechnologyCategory;
  description: string;

  maturity?: TechnologyMaturity;
  maturityDescription?: string;
}

export interface PatchTechnologyBody {
  id: string;
  name?: string;
  category?: TechnologyCategory;
  description?: string;
  maturity?: TechnologyMaturity;
  maturityDescription?: string;
  published?: boolean;
}

export type HistoryEventType =
  | "published"
  | "nameChanged"
  | "descriptionChanged"
  | "categoryChanged"
  | "maturityChanged"
  | "maturityDescriptionChanged";

export interface HistoryEvent {
  type: HistoryEventType;
  prevValue?: any;
  newValue?: any;
}

export type TechnologyHistoryData = {
  timestamp: string;
  changedBy: string;
  historyEvents: HistoryEvent;
}[];
