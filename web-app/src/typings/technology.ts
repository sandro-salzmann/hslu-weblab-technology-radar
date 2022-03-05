export type TechnologyCategory =
  | "techniques"
  | "platforms"
  | "tools"
  | "languages";

export type TechnologyMaturity = "assess" | "trial" | "adopt" | "hold";

export interface TechnologyPreview {
  id: string;
  category: TechnologyCategory;
  maturity: TechnologyMaturity;
  name: string;
  descriptionPreview: string;
}

export interface Technology {
  id: string;
  category: TechnologyCategory;
  maturity: TechnologyMaturity;
  name: string;
  description: string;
  descriptionClassification: string;
}
