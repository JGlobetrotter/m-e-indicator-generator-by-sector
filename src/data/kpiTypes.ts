export interface KPI {
  name: string;
  description: string;
  calculationMethod: string;
  unit: string;
  dataSource: string;
  category: KPICategory;
  complexity: "basic" | "advanced";
  dataAvailability: "easy" | "moderate" | "complex";
}

export type Sector =
  | "Manufacturing"
  | "Agriculture"
  | "Retail"
  | "Energy"
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Construction"
  | "Mining"
  | "Logistics"
  | "Food & Beverage"
  | "Nonprofit / Development";

export type KPICategory =
  | "Operational performance"
  | "Financial performance"
  | "Sustainability / ESG"
  | "Supply chain performance"
  | "Human rights / labor"
  | "Environmental impact"
  | "Governance and compliance"
  | "Risk management"
  | "Customer performance";

export const SECTORS: Sector[] = [
  "Manufacturing",
  "Agriculture",
  "Retail",
  "Energy",
  "Technology",
  "Finance",
  "Healthcare",
  "Construction",
  "Mining",
  "Logistics",
  "Food & Beverage",
  "Nonprofit / Development",
];

export const KPI_CATEGORIES: KPICategory[] = [
  "Operational performance",
  "Financial performance",
  "Sustainability / ESG",
  "Supply chain performance",
  "Human rights / labor",
  "Environmental impact",
  "Governance and compliance",
  "Risk management",
  "Customer performance",
];
