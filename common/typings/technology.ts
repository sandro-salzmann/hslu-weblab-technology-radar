export type TechnologyCategory =
  | "techniques"
  | "platforms"
  | "tools"
  | "languages";

export type TechnologyMaturity = "assess" | "trial" | "adopt" | "hold";

export interface TechnologyPreviewData {
  id: string;
  category: TechnologyCategory;
  maturity: TechnologyMaturity;
  name: string;
  descriptionPreview: string;
}

export interface TechnologyData {
  id: string;
  teamId: string;
  category: TechnologyCategory;
  name: string;
  description: string;

  maturity?: TechnologyMaturity;
  maturityDescription?: string;
}
