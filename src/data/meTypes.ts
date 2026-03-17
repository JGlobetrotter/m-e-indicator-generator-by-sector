export interface MEIndicator {
  id: string;
  title: string;
  definition: string;
  measurementMethod: string;
  unit: string;
  frequency: FrequencyType;
  suggestedDataSource: string;
  frameworkSource: string;
  sector: MESector;
  category: IndicatorCategory;
}

export type FrequencyType =
  | "monthly"
  | "quarterly"
  | "annually"
  | "baseline / midline / endline";

export type IndicatorCategory =
  | "Output"
  | "Outcome"
  | "Impact";

export type MESector =
  | "Health"
  | "Education"
  | "Climate & Environment"
  | "Agriculture & Food Security"
  | "Livelihoods & Economic Development"
  | "Governance & Rule of Law"
  | "Human Rights"
  | "Migration & Displacement"
  | "Gender Equality"
  | "Water, Sanitation & Hygiene (WASH)"
  | "Private Sector / ESG / Supply Chain";

export const ME_SECTORS: MESector[] = [
  "Health",
  "Education",
  "Climate & Environment",
  "Agriculture & Food Security",
  "Livelihoods & Economic Development",
  "Governance & Rule of Law",
  "Human Rights",
  "Migration & Displacement",
  "Gender Equality",
  "Water, Sanitation & Hygiene (WASH)",
  "Private Sector / ESG / Supply Chain",
];

export const FREQUENCY_OPTIONS: FrequencyType[] = [
  "monthly",
  "quarterly",
  "annually",
  "baseline / midline / endline",
];

export const INDICATOR_CATEGORIES: IndicatorCategory[] = [
  "Output",
  "Outcome",
  "Impact",
];

export interface ProjectInfo {
  organizationName: string;
  projectName: string;
  country: string;
  sector: MESector | "";
  subSector: string;
  projectDuration: string;
  targetPopulation: string;
}

export interface SelectedIndicator extends MEIndicator {
  baseline: string;
  target: string;
  customFrequency: FrequencyType;
}

export const SECTOR_ICONS: Record<MESector, string> = {
  "Health": "🏥",
  "Education": "📚",
  "Climate & Environment": "🌍",
  "Agriculture & Food Security": "🌾",
  "Livelihoods & Economic Development": "💼",
  "Governance & Rule of Law": "⚖️",
  "Human Rights": "✊",
  "Migration & Displacement": "🏠",
  "Gender Equality": "♀️",
  "Water, Sanitation & Hygiene (WASH)": "💧",
  "Private Sector / ESG / Supply Chain": "🏢",
};
