from dataclasses import dataclass, field
from typing import Literal

FrequencyType = Literal[
    "monthly",
    "quarterly",
    "annually",
    "baseline / midline / endline",
]

IndicatorCategory = Literal["Output", "Outcome", "Impact"]

MESector = Literal[
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
]

ME_SECTORS: list[str] = [
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
]

FREQUENCY_OPTIONS: list[str] = [
    "monthly",
    "quarterly",
    "annually",
    "baseline / midline / endline",
]

INDICATOR_CATEGORIES: list[str] = ["Output", "Outcome", "Impact"]

SECTOR_ICONS: dict[str, str] = {
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
}

KPISector = Literal[
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
]

KPICategory = Literal[
    "Operational performance",
    "Financial performance",
    "Sustainability / ESG",
    "Supply chain performance",
    "Human rights / labor",
    "Environmental impact",
    "Governance and compliance",
    "Risk management",
    "Customer performance",
]

KPI_SECTORS: list[str] = [
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
]

KPI_CATEGORIES: list[str] = [
    "Operational performance",
    "Financial performance",
    "Sustainability / ESG",
    "Supply chain performance",
    "Human rights / labor",
    "Environmental impact",
    "Governance and compliance",
    "Risk management",
    "Customer performance",
]


@dataclass
class MEIndicator:
    id: str
    title: str
    definition: str
    measurement_method: str
    unit: str
    frequency: str
    suggested_data_source: str
    framework_source: str
    sector: str
    category: str
    source_url: str = ""
    source_ids: list[str] = field(default_factory=list)


@dataclass
class ProjectInfo:
    organization_name: str = ""
    project_name: str = ""
    country: str = ""
    sector: str = ""
    sub_sector: str = ""
    project_duration: str = ""
    target_population: str = ""


@dataclass
class SelectedIndicator:
    indicator: MEIndicator
    baseline: str = ""
    target: str = ""
    custom_frequency: str = ""

    @property
    def effective_frequency(self) -> str:
        return self.custom_frequency or self.indicator.frequency


@dataclass
class KPI:
    name: str
    description: str
    calculation_method: str
    unit: str
    data_source: str
    category: str
    complexity: str   # "basic" | "advanced"
    data_availability: str  # "easy" | "moderate" | "complex"
    source_url: str = ""
