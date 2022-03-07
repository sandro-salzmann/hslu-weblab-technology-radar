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
