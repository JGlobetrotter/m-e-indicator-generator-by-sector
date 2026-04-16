# M&E Indicator Generator by Sector

A Streamlit web application for generating evidence-based Monitoring & Evaluation (M&E) indicator frameworks for international development projects. Indicators are aligned with globally recognised frameworks including the UN Sustainable Development Goals (SDGs), USAID, World Bank, and OECD DAC.

## Purpose

Designing a robust M&E framework from scratch is time-consuming and requires specialist knowledge of indicator standards. This tool streamlines the process by:

- Providing a curated library of **75+ pre-built indicators** spanning 11 development sectors
- Linking every indicator to its authoritative source organisation (UN SDGs, USAID, GRI, UNHCR, WHO, etc.)
- Allowing practitioners to select, customise, and export a tailored M&E framework in minutes
- Supporting both development-sector M&E (SDG / USAID aligned) and private-sector ESG / supply-chain KPIs

## Features

### M&E Indicator Generator
- **2-step wizard**: enter project details (organisation, country, sector) then browse and select indicators
- **11 sectors**: Health, Education, Climate & Environment, Agriculture & Food Security, Livelihoods & Economic Development, Governance & Rule of Law, Human Rights, Migration & Displacement, Gender Equality, WASH, Private Sector / ESG
- **Inline editing**: set baseline values, targets, and reporting frequency per indicator directly in the table
- **Source links**: each indicator displays a clickable link to the source organisation's website
- **Custom indicators**: add your own indicators alongside the pre-built library
- **Export**: download your selected framework as Excel (.xlsx) or CSV, including all metadata and source URLs

### KPI Library
- Browse 90+ cross-sector KPIs organised by category (Operational, Financial, ESG, Supply Chain, HR, Environmental, Governance, Risk, Customer)
- Filter by sector and complexity (basic / advanced)
- Export the filtered KPI list to CSV

## Getting Started

### Requirements

- Python 3.10+
- pip

### Installation

```bash
git clone https://github.com/jglobetrotter/m-e-indicator-generator-by-sector.git
cd m-e-indicator-generator-by-sector
pip install -r requirements.txt
```

### Running the app

```bash
streamlit run app.py
```

The app will open at `http://localhost:8501`.

## Project Structure

```
app.py              # Streamlit UI — main entry point
models.py           # Data models (MEIndicator, ProjectInfo, KPI, etc.)
me_database.py      # 75+ M&E indicators with source URL derivation
kpi_database.py     # 90+ KPIs by category and sector
export_utils.py     # CSV and Excel export helpers
requirements.txt    # Python dependencies
```

## Indicator Frameworks Covered

| Framework | Organisation |
|-----------|-------------|
| SDGs (Sustainable Development Goals) | United Nations |
| USAID Standard Indicators | USAID |
| World Bank Indicators | World Bank |
| GRI Standards | Global Reporting Initiative |
| TCFD Recommendations | Task Force on Climate-related Financial Disclosures |
| SASB Standards | Sustainability Accounting Standards Board |
| UNHCR / Global Compact on Refugees | UNHCR |
| WFP Food Security Indicators | World Food Programme |
| ILO Labour Statistics | International Labour Organization |
| OHCHR Human Rights Indicators | UN Office of the High Commissioner for Human Rights |
| FAO Agricultural Statistics | Food and Agriculture Organization |

## Dependencies

| Package | Purpose |
|---------|---------|
| `streamlit` | Web UI framework |
| `openpyxl` | Excel (.xlsx) export |
| `pandas` | Dataframe handling and CSV export |
