from models import KPI

# Generic KPIs organised by category — apply across all sectors
CATEGORY_KPIS: dict[str, list[KPI]] = {
    "Operational performance": [
        KPI(name="Overall Equipment Effectiveness (OEE)", description="Measures manufacturing productivity combining availability, performance, and quality", calculation_method="Availability × Performance × Quality", unit="%", data_source="Production system / MES", category="Operational performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Cycle time", description="Average time to complete one unit or process", calculation_method="Total production time / Units produced", unit="Minutes", data_source="Production logs", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Capacity utilization rate", description="Percentage of total capacity being used", calculation_method="Actual output / Maximum possible output × 100", unit="%", data_source="Operations system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Defect rate", description="Proportion of defective outputs", calculation_method="Defective units / Total units produced × 100", unit="%", data_source="Quality control records", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="On-time delivery rate", description="Percentage of deliveries completed on schedule", calculation_method="On-time deliveries / Total deliveries × 100", unit="%", data_source="Logistics / ERP system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Downtime percentage", description="Proportion of time operations are halted", calculation_method="Downtime hours / Total scheduled hours × 100", unit="%", data_source="Maintenance logs", category="Operational performance", complexity="basic", data_availability="moderate"),
        KPI(name="Process efficiency ratio", description="Ratio of value-added time to total process time", calculation_method="Value-added time / Total process time", unit="Ratio", data_source="Process mapping data", category="Operational performance", complexity="advanced", data_availability="complex"),
        KPI(name="First pass yield", description="Percentage of units passing quality on first attempt", calculation_method="Good units on first pass / Total units started × 100", unit="%", data_source="Quality management system", category="Operational performance", complexity="basic", data_availability="moderate"),
    ],
    "Financial performance": [
        KPI(name="Revenue growth rate", description="Year-over-year change in revenue", calculation_method="(Current revenue − Previous revenue) / Previous revenue × 100", unit="%", data_source="Financial statements", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Gross profit margin", description="Revenue remaining after cost of goods sold", calculation_method="(Revenue − COGS) / Revenue × 100", unit="%", data_source="Income statement", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Operating expense ratio", description="Operating expenses as percentage of revenue", calculation_method="Operating expenses / Revenue × 100", unit="%", data_source="Financial statements", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Return on assets (ROA)", description="Net income relative to total assets", calculation_method="Net income / Total assets × 100", unit="%", data_source="Financial statements", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Return on investment (ROI)", description="Gain from investment relative to its cost", calculation_method="(Gain − Cost) / Cost × 100", unit="%", data_source="Financial records", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Cost per unit", description="Average cost to produce one unit", calculation_method="Total production costs / Total units produced", unit="Currency", data_source="Cost accounting system", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="EBITDA margin", description="Earnings before interest, taxes, depreciation and amortization as % of revenue", calculation_method="EBITDA / Revenue × 100", unit="%", data_source="Financial statements", category="Financial performance", complexity="advanced", data_availability="easy"),
        KPI(name="Working capital ratio", description="Ability to cover short-term obligations", calculation_method="Current assets / Current liabilities", unit="Ratio", data_source="Balance sheet", category="Financial performance", complexity="basic", data_availability="easy"),
    ],
    "Sustainability / ESG": [
        KPI(name="Carbon footprint", description="Total greenhouse gas emissions", calculation_method="Sum of Scope 1 + 2 + 3 emissions", unit="tCO₂e", data_source="Emissions tracking system", category="Sustainability / ESG", complexity="advanced", data_availability="complex"),
        KPI(name="Supplier sustainability compliance rate", description="Percentage of suppliers meeting ESG requirements", calculation_method="Compliant suppliers / Total suppliers × 100", unit="%", data_source="Supplier audits", category="Sustainability / ESG", complexity="advanced", data_availability="moderate"),
        KPI(name="ESG disclosure score", description="Completeness of ESG reporting against frameworks", calculation_method="Disclosed indicators / Required indicators × 100", unit="Score", data_source="ESG reporting platform", category="Sustainability / ESG", complexity="advanced", data_availability="moderate"),
        KPI(name="Renewable energy share", description="Percentage of energy from renewable sources", calculation_method="Renewable energy consumed / Total energy consumed × 100", unit="%", data_source="Energy procurement records", category="Sustainability / ESG", complexity="basic", data_availability="moderate"),
        KPI(name="Waste diversion rate", description="Percentage of waste diverted from landfill", calculation_method="Recycled + composted waste / Total waste × 100", unit="%", data_source="Waste management records", category="Sustainability / ESG", complexity="basic", data_availability="moderate"),
        KPI(name="Community investment rate", description="Investment in community programs relative to revenue", calculation_method="Community investment / Revenue × 100", unit="%", data_source="CSR reports", category="Sustainability / ESG", complexity="basic", data_availability="easy"),
        KPI(name="Sustainability-linked revenue", description="Revenue from sustainable products or services", calculation_method="Sustainable product revenue / Total revenue × 100", unit="%", data_source="Sales and product data", category="Sustainability / ESG", complexity="advanced", data_availability="complex"),
    ],
    "Supply chain performance": [
        KPI(name="Supplier lead time", description="Average time from order to delivery by suppliers", calculation_method="Sum of lead times / Number of orders", unit="Days", data_source="Procurement system", category="Supply chain performance", complexity="basic", data_availability="easy"),
        KPI(name="Order accuracy rate", description="Percentage of orders fulfilled correctly", calculation_method="Correct orders / Total orders × 100", unit="%", data_source="Order management system", category="Supply chain performance", complexity="basic", data_availability="easy"),
        KPI(name="Inventory turnover", description="How often inventory is sold and replaced", calculation_method="Cost of goods sold / Average inventory", unit="Times", data_source="Inventory management system", category="Supply chain performance", complexity="basic", data_availability="easy"),
        KPI(name="Supply chain cost as % of revenue", description="Total supply chain costs relative to revenue", calculation_method="Total supply chain costs / Revenue × 100", unit="%", data_source="Financial / procurement systems", category="Supply chain performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Supplier defect rate", description="Rate of defective materials from suppliers", calculation_method="Defective items received / Total items received × 100", unit="%", data_source="Quality inspection records", category="Supply chain performance", complexity="basic", data_availability="moderate"),
        KPI(name="Perfect order rate", description="Percentage of orders delivered complete, on time, damage-free, with correct documentation", calculation_method="Perfect orders / Total orders × 100", unit="%", data_source="Logistics and order systems", category="Supply chain performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Procurement cycle time", description="Time from purchase requisition to order fulfillment", calculation_method="Average days from request to delivery", unit="Days", data_source="Procurement system", category="Supply chain performance", complexity="basic", data_availability="easy"),
    ],
    "Human rights / labor": [
        KPI(name="Employee turnover rate", description="Percentage of employees leaving the company", calculation_method="Employees leaving / Total employees × 100", unit="%", data_source="HR system", category="Human rights / labor", complexity="basic", data_availability="easy"),
        KPI(name="Gender pay gap ratio", description="Difference in average pay between genders", calculation_method="(Male avg pay − Female avg pay) / Male avg pay × 100", unit="%", data_source="Payroll system", category="Human rights / labor", complexity="advanced", data_availability="moderate"),
        KPI(name="Lost time injury frequency rate (LTIFR)", description="Number of lost-time injuries per million hours worked", calculation_method="Lost-time injuries × 1,000,000 / Total hours worked", unit="Rate", data_source="Safety incident records", category="Human rights / labor", complexity="basic", data_availability="easy"),
        KPI(name="Training hours per employee", description="Average training investment per worker", calculation_method="Total training hours / Number of employees", unit="Hours", data_source="Training management system", category="Human rights / labor", complexity="basic", data_availability="easy"),
        KPI(name="Diversity index", description="Representation across demographic groups", calculation_method="Weighted diversity score across categories", unit="Score", data_source="HR demographics data", category="Human rights / labor", complexity="advanced", data_availability="moderate"),
        KPI(name="Living wage compliance", description="Percentage of workforce paid above living wage", calculation_method="Employees above living wage / Total employees × 100", unit="%", data_source="Payroll / external benchmarks", category="Human rights / labor", complexity="advanced", data_availability="complex"),
        KPI(name="Grievance resolution rate", description="Percentage of employee grievances resolved within target time", calculation_method="Resolved grievances / Total grievances × 100", unit="%", data_source="HR case management", category="Human rights / labor", complexity="basic", data_availability="moderate"),
        KPI(name="Child labor risk assessment score", description="Score reflecting exposure to child labor risks in operations/supply chain", calculation_method="Weighted risk factors across operations", unit="Score", data_source="Audit / risk assessment", category="Human rights / labor", complexity="advanced", data_availability="complex"),
    ],
    "Environmental impact": [
        KPI(name="Energy intensity", description="Energy use per unit produced or per revenue", calculation_method="Total energy consumed / Output volume or revenue", unit="kWh/unit", data_source="Energy meters / utility bills", category="Environmental impact", complexity="basic", data_availability="easy"),
        KPI(name="Water consumption intensity", description="Water use per unit of output", calculation_method="Total water consumed / Output volume", unit="m³/unit", data_source="Water meters", category="Environmental impact", complexity="basic", data_availability="easy"),
        KPI(name="Waste generation rate", description="Total waste produced per unit of output", calculation_method="Total waste / Output volume", unit="kg/unit", data_source="Waste tracking records", category="Environmental impact", complexity="basic", data_availability="moderate"),
        KPI(name="Air pollutant emissions", description="Volume of regulated air pollutants emitted", calculation_method="Sum of NOx, SOx, PM, VOC emissions", unit="Tonnes", data_source="Emissions monitoring", category="Environmental impact", complexity="advanced", data_availability="complex"),
        KPI(name="Biodiversity impact score", description="Assessment of operations impact on local ecosystems", calculation_method="Weighted impact across biodiversity indicators", unit="Score", data_source="Environmental impact assessments", category="Environmental impact", complexity="advanced", data_availability="complex"),
        KPI(name="Hazardous waste ratio", description="Proportion of waste classified as hazardous", calculation_method="Hazardous waste / Total waste × 100", unit="%", data_source="Waste manifests", category="Environmental impact", complexity="basic", data_availability="moderate"),
        KPI(name="GHG emissions reduction rate", description="Year-over-year reduction in greenhouse gas emissions", calculation_method="(Previous year emissions − Current year) / Previous year × 100", unit="%", data_source="Emissions inventory", category="Environmental impact", complexity="advanced", data_availability="moderate"),
    ],
    "Governance and compliance": [
        KPI(name="Regulatory compliance rate", description="Percentage of compliance with applicable regulations", calculation_method="Compliant items / Total regulatory requirements × 100", unit="%", data_source="Compliance tracking system", category="Governance and compliance", complexity="basic", data_availability="moderate"),
        KPI(name="Audit findings closure rate", description="Percentage of audit findings resolved on time", calculation_method="Closed findings / Total findings × 100", unit="%", data_source="Internal audit system", category="Governance and compliance", complexity="basic", data_availability="easy"),
        KPI(name="Anti-corruption training coverage", description="Percentage of staff completing anti-corruption training", calculation_method="Trained employees / Total employees × 100", unit="%", data_source="Training records", category="Governance and compliance", complexity="basic", data_availability="easy"),
        KPI(name="Board diversity ratio", description="Diversity representation on the board of directors", calculation_method="Diverse members / Total board members × 100", unit="%", data_source="Corporate governance records", category="Governance and compliance", complexity="basic", data_availability="easy"),
        KPI(name="Policy review completion rate", description="Percentage of policies reviewed within schedule", calculation_method="Reviewed policies / Total policies due × 100", unit="%", data_source="Policy management system", category="Governance and compliance", complexity="basic", data_availability="easy"),
        KPI(name="Whistleblower reports resolved", description="Rate of resolution for whistleblower complaints", calculation_method="Resolved reports / Total reports × 100", unit="%", data_source="Ethics hotline / case management", category="Governance and compliance", complexity="advanced", data_availability="moderate"),
        KPI(name="Data privacy compliance score", description="Compliance level with data protection regulations", calculation_method="Score based on GDPR/CCPA compliance checklist", unit="Score", data_source="Privacy audit", category="Governance and compliance", complexity="advanced", data_availability="complex"),
    ],
    "Risk management": [
        KPI(name="Risk mitigation effectiveness", description="Percentage of identified risks with active controls", calculation_method="Mitigated risks / Total identified risks × 100", unit="%", data_source="Risk register", category="Risk management", complexity="basic", data_availability="moderate"),
        KPI(name="Incident response time", description="Average time to respond to risk incidents", calculation_method="Sum of response times / Number of incidents", unit="Hours", data_source="Incident management system", category="Risk management", complexity="basic", data_availability="easy"),
        KPI(name="Business continuity plan test rate", description="Frequency of BCP testing", calculation_method="Tests conducted / Planned tests × 100", unit="%", data_source="BCP documentation", category="Risk management", complexity="basic", data_availability="easy"),
        KPI(name="Insurance coverage ratio", description="Insured value relative to total asset value", calculation_method="Insured assets / Total assets × 100", unit="%", data_source="Insurance policies / asset register", category="Risk management", complexity="basic", data_availability="easy"),
        KPI(name="Cybersecurity incident rate", description="Number of security incidents per period", calculation_method="Total cybersecurity incidents / Time period", unit="Count", data_source="IT security logs", category="Risk management", complexity="advanced", data_availability="moderate"),
        KPI(name="Compliance violation frequency", description="Number of compliance violations per period", calculation_method="Total violations / Reporting period", unit="Count", data_source="Compliance system", category="Risk management", complexity="basic", data_availability="moderate"),
        KPI(name="Risk appetite utilization", description="Current risk exposure vs defined risk appetite", calculation_method="Current risk level / Risk appetite threshold × 100", unit="%", data_source="Enterprise risk management", category="Risk management", complexity="advanced", data_availability="complex"),
    ],
    "Customer performance": [
        KPI(name="Customer satisfaction score (CSAT)", description="Average customer satisfaction rating", calculation_method="Sum of satisfaction ratings / Number of responses", unit="Score", data_source="Customer surveys", category="Customer performance", complexity="basic", data_availability="easy"),
        KPI(name="Net Promoter Score (NPS)", description="Likelihood of customers recommending the company", calculation_method="% Promoters − % Detractors", unit="Score", data_source="NPS surveys", category="Customer performance", complexity="basic", data_availability="easy"),
        KPI(name="Customer retention rate", description="Percentage of customers retained over a period", calculation_method="(End customers − New customers) / Start customers × 100", unit="%", data_source="CRM system", category="Customer performance", complexity="basic", data_availability="easy"),
        KPI(name="Customer acquisition cost (CAC)", description="Average cost to acquire a new customer", calculation_method="Total acquisition spend / New customers acquired", unit="Currency", data_source="Marketing / financial data", category="Customer performance", complexity="basic", data_availability="moderate"),
        KPI(name="Customer lifetime value (CLV)", description="Predicted total revenue from a customer", calculation_method="Average purchase value × Frequency × Lifespan", unit="Currency", data_source="CRM / financial data", category="Customer performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Complaint resolution time", description="Average time to resolve customer complaints", calculation_method="Total resolution time / Number of complaints", unit="Hours", data_source="Customer support system", category="Customer performance", complexity="basic", data_availability="easy"),
        KPI(name="Customer churn rate", description="Percentage of customers lost over a period", calculation_method="Lost customers / Total customers at start × 100", unit="%", data_source="CRM system", category="Customer performance", complexity="basic", data_availability="easy"),
    ],
}

# Sector-specific KPIs that supplement the category KPIs above
SECTOR_SPECIFIC_KPIS: dict[str, list[KPI]] = {
    "Manufacturing": [
        KPI(name="Scrap rate", description="Percentage of raw materials wasted in production", calculation_method="Scrap weight / Total material input × 100", unit="%", data_source="Production records", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Mean time between failures (MTBF)", description="Average time between equipment breakdowns", calculation_method="Total operating time / Number of failures", unit="Hours", data_source="Maintenance system", category="Operational performance", complexity="advanced", data_availability="moderate"),
    ],
    "Agriculture": [
        KPI(name="Crop yield per hectare", description="Agricultural output per unit of land", calculation_method="Total harvest / Cultivated area", unit="Tonnes/ha", data_source="Farm records", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Water use efficiency", description="Crop output per unit of water consumed", calculation_method="Crop yield / Water consumed", unit="kg/m³", data_source="Irrigation records", category="Environmental impact", complexity="basic", data_availability="moderate"),
    ],
    "Retail": [
        KPI(name="Sales per square foot", description="Revenue generated per unit of retail space", calculation_method="Total sales / Total selling area", unit="Currency/ft²", data_source="POS / property data", category="Financial performance", complexity="basic", data_availability="easy"),
        KPI(name="Shrinkage rate", description="Loss of inventory due to theft, damage, or errors", calculation_method="Lost inventory value / Total inventory value × 100", unit="%", data_source="Inventory audit", category="Operational performance", complexity="basic", data_availability="moderate"),
    ],
    "Energy": [
        KPI(name="Grid reliability index", description="Percentage of time the grid is operational", calculation_method="Uptime hours / Total hours × 100", unit="%", data_source="Grid monitoring system", category="Operational performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Levelized cost of energy (LCOE)", description="Average cost of energy generation over lifetime", calculation_method="Total lifecycle costs / Total energy produced", unit="Currency/MWh", data_source="Financial / engineering data", category="Financial performance", complexity="advanced", data_availability="complex"),
    ],
    "Technology": [
        KPI(name="System uptime", description="Percentage of time systems are operational", calculation_method="Uptime / (Uptime + Downtime) × 100", unit="%", data_source="Monitoring tools", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Sprint velocity", description="Amount of work completed per sprint", calculation_method="Sum of story points completed per sprint", unit="Points", data_source="Project management tool", category="Operational performance", complexity="basic", data_availability="easy"),
    ],
    "Finance": [
        KPI(name="Non-performing loan ratio", description="Percentage of loans in default or near default", calculation_method="Non-performing loans / Total loans × 100", unit="%", data_source="Loan management system", category="Risk management", complexity="advanced", data_availability="easy"),
        KPI(name="Cost-to-income ratio", description="Operating costs relative to operating income", calculation_method="Operating costs / Operating income × 100", unit="%", data_source="Financial statements", category="Financial performance", complexity="basic", data_availability="easy"),
    ],
    "Healthcare": [
        KPI(name="Patient readmission rate", description="Percentage of patients readmitted within 30 days", calculation_method="Readmissions / Total discharges × 100", unit="%", data_source="Patient records system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Bed occupancy rate", description="Percentage of hospital beds in use", calculation_method="Occupied beds / Total beds × 100", unit="%", data_source="Hospital management system", category="Operational performance", complexity="basic", data_availability="easy"),
    ],
    "Construction": [
        KPI(name="Project schedule variance", description="Deviation from planned project timeline", calculation_method="(Planned duration − Actual duration) / Planned duration × 100", unit="%", data_source="Project management system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Cost overrun percentage", description="Amount by which actual costs exceed budget", calculation_method="(Actual cost − Budget) / Budget × 100", unit="%", data_source="Cost tracking system", category="Financial performance", complexity="basic", data_availability="easy"),
    ],
    "Mining": [
        KPI(name="Ore recovery rate", description="Percentage of valuable material extracted", calculation_method="Recovered ore / Total ore processed × 100", unit="%", data_source="Processing plant data", category="Operational performance", complexity="advanced", data_availability="moderate"),
        KPI(name="Tailings management index", description="Effectiveness of mine waste management", calculation_method="Composite score across safety, environmental, and volume metrics", unit="Score", data_source="Environmental monitoring", category="Environmental impact", complexity="advanced", data_availability="complex"),
    ],
    "Logistics": [
        KPI(name="Fleet utilization rate", description="Percentage of fleet capacity being used", calculation_method="Used capacity / Total capacity × 100", unit="%", data_source="Fleet management system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Cost per kilometer", description="Transportation cost per distance unit", calculation_method="Total transport costs / Total kilometers", unit="Currency/km", data_source="Transport management system", category="Financial performance", complexity="basic", data_availability="easy"),
    ],
    "Food & Beverage": [
        KPI(name="Food safety incident rate", description="Number of food safety incidents per production volume", calculation_method="Incidents / Total batches × 100", unit="%", data_source="Quality management system", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Food waste percentage", description="Proportion of food wasted in production", calculation_method="Wasted food / Total food processed × 100", unit="%", data_source="Production records", category="Environmental impact", complexity="basic", data_availability="moderate"),
    ],
    "Nonprofit / Development": [
        KPI(name="Beneficiary reach rate", description="Number of beneficiaries served relative to target", calculation_method="Actual beneficiaries / Target beneficiaries × 100", unit="%", data_source="Program monitoring data", category="Operational performance", complexity="basic", data_availability="easy"),
        KPI(name="Program cost efficiency", description="Cost per beneficiary served", calculation_method="Total program cost / Number of beneficiaries", unit="Currency", data_source="Financial / program data", category="Financial performance", complexity="basic", data_availability="easy"),
    ],
}


def get_kpis_for_sector_and_categories(sector: str, categories: list[str]) -> list[KPI]:
    results: list[KPI] = []
    for cat in categories:
        results.extend(CATEGORY_KPIS.get(cat, []))
    sector_kpis = SECTOR_SPECIFIC_KPIS.get(sector, [])
    for kpi in sector_kpis:
        if kpi.category in categories:
            results.append(kpi)
    return results
