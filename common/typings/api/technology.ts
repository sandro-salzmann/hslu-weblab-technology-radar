import { TechnologyCategory, TechnologyMaturity } from "../technology";

export interface PostTechnologyBody {
  name: string;
  category: TechnologyCategory;
  description: string;

  maturity?: TechnologyMaturity;
  maturityDescription?: string;
}
