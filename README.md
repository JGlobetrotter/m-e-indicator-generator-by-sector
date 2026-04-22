📊 M&E + KPI Library

Standard Indicators & KPIs with Source Links

🔍 Overview

This project is a unified Monitoring & Evaluation (M&E) and KPI library designed to support:

International Development Practitioners:
MEAL practitioners
Proposal writers
Donor reporting teams
Consultants and analysts

(and / or)

Business Practitioners:
Sustainability Units
Compliance Experts
Operational and Supply Chain Units


The library provides:
- A searchable repository of standardized M&E indicators & KPIs
- A mapped ecosystem of indicator sources
- A traceable link between indicators and their original frameworks# M&E Indicator Generator by Sector

It connects to a Streamlit web application for its UI. 


📊 M&E Library

Purpose 

Designing a robust M&E framework from scratch is time-consuming and requires specialist knowledge of indicator standards. This tool streamlines the process by:
- Providing a curated library of **75+ pre-built indicators** spanning 11 development sectors
- Linking every indicator to its authoritative source organisation (UN SDGs, USAID, GRI, UNHCR, WHO, etc.)
- Allowing practitioners to select, customise, and export a tailored M&E framework in minutes
- Supporting both development-sector M&E (SDG / USAID aligned) and private-sector ESG / supply-chain KPIs

This system is designed to power:
Indicator lookup tools
Proposal generators
Results framework builders
ESG and sustainability reporting tools
Donor compliance systems
Humanitarian needs assessments
Decision-support dashboards

Stage 1: Source Library 
- A registry of major standard indicator sources

Examples:
-DHS (Demographic and Health Surveys)
-UNICEF MICS
-WHO Core Health Indicators
-OCHA Humanitarian Indicator Registry
-Cluster indicator registries (Nutrition, WASH, Shelter, Protection)
-Donor frameworks (USAID, MCC, EU, PEPFAR, etc.)

Stage 2: Indicator Library 

Each indicator includes:
- exact wording (verbatim when possible)
- indicator code (if available)
- sector and domain
- definition (if available)
- numerator / denominator (if available)
- disaggregations
- calculation method
- metadata fields (version, language, etc.)

- Note : Each indicator is linked to its original source


📂 Source Types

Each source is categorized as one of the following:

Indicator Registry
Structured list of indicators (e.g., SDG framework, cluster registries)
Metadata Library
Definitions, methodologies, and calculation rules
Survey Indicator Guide
Indicator construction logic (e.g., DHS)
Survey Instrument / Question Repository
Question banks used to derive indicators (e.g., MICS)
Donor Framework
Indicators tied to funding and reporting systems
Humanitarian Cluster Registry
Inter-agency standardized indicators

⚠️ Important Design Principles (Guardrails)
1. Public sources only

All data comes from publicly accessible sources and stable URLs

Export the filtered Indicator list.


📊 KPI Library
- Browse 90+ cross-sector KPIs organised by category (Operational, Financial, ESG, Supply Chain, HR, Environmental, Governance, Risk, Customer)
- Filter by sector and complexity (basic / advanced)
- Export the filtered KPI list to CSV

Note: KPI Library under construction


## Project Structure
```
app.py              # Streamlit UI — main entry point
models.py           # Data models (MEIndicator, ProjectInfo, KPI, etc.)
me_database.py      # 75+ M&E indicators with source URL derivation
kpi_database.py     # 90+ KPIs by category and sector
export_utils.py     # CSV and Excel export helpers
requirements.txt    # Python dependencies
```
KPI library still under construction

| Package | Purpose |
|---------|---------|
| `streamlit` | Web UI framework |
| `openpyxl` | Excel (.xlsx) export |
| `pandas` | Dataframe handling and CSV export |

This project requires permission for licensing.
