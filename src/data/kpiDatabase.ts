import { KPI, KPICategory } from "./kpiTypes";

// Generic KPIs by category that apply across sectors
const categoryKPIs: Record<KPICategory, KPI[]> = {
  "Operational performance": [
    { name: "Overall Equipment Effectiveness (OEE)", description: "Measures manufacturing productivity combining availability, performance, and quality", calculationMethod: "Availability × Performance × Quality", unit: "%", dataSource: "Production system / MES", category: "Operational performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Cycle time", description: "Average time to complete one unit or process", calculationMethod: "Total production time / Units produced", unit: "Minutes", dataSource: "Production logs", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Capacity utilization rate", description: "Percentage of total capacity being used", calculationMethod: "Actual output / Maximum possible output × 100", unit: "%", dataSource: "Operations system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Defect rate", description: "Proportion of defective outputs", calculationMethod: "Defective units / Total units produced × 100", unit: "%", dataSource: "Quality control records", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "On-time delivery rate", description: "Percentage of deliveries completed on schedule", calculationMethod: "On-time deliveries / Total deliveries × 100", unit: "%", dataSource: "Logistics / ERP system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Downtime percentage", description: "Proportion of time operations are halted", calculationMethod: "Downtime hours / Total scheduled hours × 100", unit: "%", dataSource: "Maintenance logs", category: "Operational performance", complexity: "basic", dataAvailability: "moderate" },
    { name: "Process efficiency ratio", description: "Ratio of value-added time to total process time", calculationMethod: "Value-added time / Total process time", unit: "Ratio", dataSource: "Process mapping data", category: "Operational performance", complexity: "advanced", dataAvailability: "complex" },
    { name: "First pass yield", description: "Percentage of units passing quality on first attempt", calculationMethod: "Good units on first pass / Total units started × 100", unit: "%", dataSource: "Quality management system", category: "Operational performance", complexity: "basic", dataAvailability: "moderate" },
  ],
  "Financial performance": [
    { name: "Revenue growth rate", description: "Year-over-year change in revenue", calculationMethod: "(Current revenue − Previous revenue) / Previous revenue × 100", unit: "%", dataSource: "Financial statements", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Gross profit margin", description: "Revenue remaining after cost of goods sold", calculationMethod: "(Revenue − COGS) / Revenue × 100", unit: "%", dataSource: "Income statement", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Operating expense ratio", description: "Operating expenses as percentage of revenue", calculationMethod: "Operating expenses / Revenue × 100", unit: "%", dataSource: "Financial statements", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Return on assets (ROA)", description: "Net income relative to total assets", calculationMethod: "Net income / Total assets × 100", unit: "%", dataSource: "Financial statements", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Return on investment (ROI)", description: "Gain from investment relative to its cost", calculationMethod: "(Gain − Cost) / Cost × 100", unit: "%", dataSource: "Financial records", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Cost per unit", description: "Average cost to produce one unit", calculationMethod: "Total production costs / Total units produced", unit: "Currency", dataSource: "Cost accounting system", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "EBITDA margin", description: "Earnings before interest, taxes, depreciation and amortization as % of revenue", calculationMethod: "EBITDA / Revenue × 100", unit: "%", dataSource: "Financial statements", category: "Financial performance", complexity: "advanced", dataAvailability: "easy" },
    { name: "Working capital ratio", description: "Ability to cover short-term obligations", calculationMethod: "Current assets / Current liabilities", unit: "Ratio", dataSource: "Balance sheet", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
  ],
  "Sustainability / ESG": [
    { name: "Carbon footprint", description: "Total greenhouse gas emissions", calculationMethod: "Sum of Scope 1 + 2 + 3 emissions", unit: "tCO₂e", dataSource: "Emissions tracking system", category: "Sustainability / ESG", complexity: "advanced", dataAvailability: "complex" },
    { name: "Supplier sustainability compliance rate", description: "Percentage of suppliers meeting ESG requirements", calculationMethod: "Compliant suppliers / Total suppliers × 100", unit: "%", dataSource: "Supplier audits", category: "Sustainability / ESG", complexity: "advanced", dataAvailability: "moderate" },
    { name: "ESG disclosure score", description: "Completeness of ESG reporting against frameworks", calculationMethod: "Disclosed indicators / Required indicators × 100", unit: "Score", dataSource: "ESG reporting platform", category: "Sustainability / ESG", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Renewable energy share", description: "Percentage of energy from renewable sources", calculationMethod: "Renewable energy consumed / Total energy consumed × 100", unit: "%", dataSource: "Energy procurement records", category: "Sustainability / ESG", complexity: "basic", dataAvailability: "moderate" },
    { name: "Waste diversion rate", description: "Percentage of waste diverted from landfill", calculationMethod: "Recycled + composted waste / Total waste × 100", unit: "%", dataSource: "Waste management records", category: "Sustainability / ESG", complexity: "basic", dataAvailability: "moderate" },
    { name: "Community investment rate", description: "Investment in community programs relative to revenue", calculationMethod: "Community investment / Revenue × 100", unit: "%", dataSource: "CSR reports", category: "Sustainability / ESG", complexity: "basic", dataAvailability: "easy" },
    { name: "Sustainability-linked revenue", description: "Revenue from sustainable products or services", calculationMethod: "Sustainable product revenue / Total revenue × 100", unit: "%", dataSource: "Sales and product data", category: "Sustainability / ESG", complexity: "advanced", dataAvailability: "complex" },
  ],
  "Supply chain performance": [
    { name: "Supplier lead time", description: "Average time from order to delivery by suppliers", calculationMethod: "Sum of lead times / Number of orders", unit: "Days", dataSource: "Procurement system", category: "Supply chain performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Order accuracy rate", description: "Percentage of orders fulfilled correctly", calculationMethod: "Correct orders / Total orders × 100", unit: "%", dataSource: "Order management system", category: "Supply chain performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Inventory turnover", description: "How often inventory is sold and replaced", calculationMethod: "Cost of goods sold / Average inventory", unit: "Times", dataSource: "Inventory management system", category: "Supply chain performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Supply chain cost as % of revenue", description: "Total supply chain costs relative to revenue", calculationMethod: "Total supply chain costs / Revenue × 100", unit: "%", dataSource: "Financial / procurement systems", category: "Supply chain performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Supplier defect rate", description: "Rate of defective materials from suppliers", calculationMethod: "Defective items received / Total items received × 100", unit: "%", dataSource: "Quality inspection records", category: "Supply chain performance", complexity: "basic", dataAvailability: "moderate" },
    { name: "Perfect order rate", description: "Percentage of orders delivered complete, on time, damage-free, with correct documentation", calculationMethod: "Perfect orders / Total orders × 100", unit: "%", dataSource: "Logistics and order systems", category: "Supply chain performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Procurement cycle time", description: "Time from purchase requisition to order fulfillment", calculationMethod: "Average days from request to delivery", unit: "Days", dataSource: "Procurement system", category: "Supply chain performance", complexity: "basic", dataAvailability: "easy" },
  ],
  "Human rights / labor": [
    { name: "Employee turnover rate", description: "Percentage of employees leaving the company", calculationMethod: "Employees leaving / Total employees × 100", unit: "%", dataSource: "HR system", category: "Human rights / labor", complexity: "basic", dataAvailability: "easy" },
    { name: "Gender pay gap ratio", description: "Difference in average pay between genders", calculationMethod: "(Male avg pay − Female avg pay) / Male avg pay × 100", unit: "%", dataSource: "Payroll system", category: "Human rights / labor", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Lost time injury frequency rate (LTIFR)", description: "Number of lost-time injuries per million hours worked", calculationMethod: "Lost-time injuries × 1,000,000 / Total hours worked", unit: "Rate", dataSource: "Safety incident records", category: "Human rights / labor", complexity: "basic", dataAvailability: "easy" },
    { name: "Training hours per employee", description: "Average training investment per worker", calculationMethod: "Total training hours / Number of employees", unit: "Hours", dataSource: "Training management system", category: "Human rights / labor", complexity: "basic", dataAvailability: "easy" },
    { name: "Diversity index", description: "Representation across demographic groups", calculationMethod: "Weighted diversity score across categories", unit: "Score", dataSource: "HR demographics data", category: "Human rights / labor", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Living wage compliance", description: "Percentage of workforce paid above living wage", calculationMethod: "Employees above living wage / Total employees × 100", unit: "%", dataSource: "Payroll / external benchmarks", category: "Human rights / labor", complexity: "advanced", dataAvailability: "complex" },
    { name: "Grievance resolution rate", description: "Percentage of employee grievances resolved within target time", calculationMethod: "Resolved grievances / Total grievances × 100", unit: "%", dataSource: "HR case management", category: "Human rights / labor", complexity: "basic", dataAvailability: "moderate" },
    { name: "Child labor risk assessment score", description: "Score reflecting exposure to child labor risks in operations/supply chain", calculationMethod: "Weighted risk factors across operations", unit: "Score", dataSource: "Audit / risk assessment", category: "Human rights / labor", complexity: "advanced", dataAvailability: "complex" },
  ],
  "Environmental impact": [
    { name: "Energy intensity", description: "Energy use per unit produced or per revenue", calculationMethod: "Total energy consumed / Output volume or revenue", unit: "kWh/unit", dataSource: "Energy meters / utility bills", category: "Environmental impact", complexity: "basic", dataAvailability: "easy" },
    { name: "Water consumption intensity", description: "Water use per unit of output", calculationMethod: "Total water consumed / Output volume", unit: "m³/unit", dataSource: "Water meters", category: "Environmental impact", complexity: "basic", dataAvailability: "easy" },
    { name: "Waste generation rate", description: "Total waste produced per unit of output", calculationMethod: "Total waste / Output volume", unit: "kg/unit", dataSource: "Waste tracking records", category: "Environmental impact", complexity: "basic", dataAvailability: "moderate" },
    { name: "Air pollutant emissions", description: "Volume of regulated air pollutants emitted", calculationMethod: "Sum of NOx, SOx, PM, VOC emissions", unit: "Tonnes", dataSource: "Emissions monitoring", category: "Environmental impact", complexity: "advanced", dataAvailability: "complex" },
    { name: "Biodiversity impact score", description: "Assessment of operations impact on local ecosystems", calculationMethod: "Weighted impact across biodiversity indicators", unit: "Score", dataSource: "Environmental impact assessments", category: "Environmental impact", complexity: "advanced", dataAvailability: "complex" },
    { name: "Hazardous waste ratio", description: "Proportion of waste classified as hazardous", calculationMethod: "Hazardous waste / Total waste × 100", unit: "%", dataSource: "Waste manifests", category: "Environmental impact", complexity: "basic", dataAvailability: "moderate" },
    { name: "GHG emissions reduction rate", description: "Year-over-year reduction in greenhouse gas emissions", calculationMethod: "(Previous year emissions − Current year) / Previous year × 100", unit: "%", dataSource: "Emissions inventory", category: "Environmental impact", complexity: "advanced", dataAvailability: "moderate" },
  ],
  "Governance and compliance": [
    { name: "Regulatory compliance rate", description: "Percentage of compliance with applicable regulations", calculationMethod: "Compliant items / Total regulatory requirements × 100", unit: "%", dataSource: "Compliance tracking system", category: "Governance and compliance", complexity: "basic", dataAvailability: "moderate" },
    { name: "Audit findings closure rate", description: "Percentage of audit findings resolved on time", calculationMethod: "Closed findings / Total findings × 100", unit: "%", dataSource: "Internal audit system", category: "Governance and compliance", complexity: "basic", dataAvailability: "easy" },
    { name: "Anti-corruption training coverage", description: "Percentage of staff completing anti-corruption training", calculationMethod: "Trained employees / Total employees × 100", unit: "%", dataSource: "Training records", category: "Governance and compliance", complexity: "basic", dataAvailability: "easy" },
    { name: "Board diversity ratio", description: "Diversity representation on the board of directors", calculationMethod: "Diverse members / Total board members × 100", unit: "%", dataSource: "Corporate governance records", category: "Governance and compliance", complexity: "basic", dataAvailability: "easy" },
    { name: "Policy review completion rate", description: "Percentage of policies reviewed within schedule", calculationMethod: "Reviewed policies / Total policies due × 100", unit: "%", dataSource: "Policy management system", category: "Governance and compliance", complexity: "basic", dataAvailability: "easy" },
    { name: "Whistleblower reports resolved", description: "Rate of resolution for whistleblower complaints", calculationMethod: "Resolved reports / Total reports × 100", unit: "%", dataSource: "Ethics hotline / case management", category: "Governance and compliance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Data privacy compliance score", description: "Compliance level with data protection regulations", calculationMethod: "Score based on GDPR/CCPA compliance checklist", unit: "Score", dataSource: "Privacy audit", category: "Governance and compliance", complexity: "advanced", dataAvailability: "complex" },
  ],
  "Risk management": [
    { name: "Risk mitigation effectiveness", description: "Percentage of identified risks with active controls", calculationMethod: "Mitigated risks / Total identified risks × 100", unit: "%", dataSource: "Risk register", category: "Risk management", complexity: "basic", dataAvailability: "moderate" },
    { name: "Incident response time", description: "Average time to respond to risk incidents", calculationMethod: "Sum of response times / Number of incidents", unit: "Hours", dataSource: "Incident management system", category: "Risk management", complexity: "basic", dataAvailability: "easy" },
    { name: "Business continuity plan test rate", description: "Frequency of BCP testing", calculationMethod: "Tests conducted / Planned tests × 100", unit: "%", dataSource: "BCP documentation", category: "Risk management", complexity: "basic", dataAvailability: "easy" },
    { name: "Insurance coverage ratio", description: "Insured value relative to total asset value", calculationMethod: "Insured assets / Total assets × 100", unit: "%", dataSource: "Insurance policies / asset register", category: "Risk management", complexity: "basic", dataAvailability: "easy" },
    { name: "Cybersecurity incident rate", description: "Number of security incidents per period", calculationMethod: "Total cybersecurity incidents / Time period", unit: "Count", dataSource: "IT security logs", category: "Risk management", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Compliance violation frequency", description: "Number of compliance violations per period", calculationMethod: "Total violations / Reporting period", unit: "Count", dataSource: "Compliance system", category: "Risk management", complexity: "basic", dataAvailability: "moderate" },
    { name: "Risk appetite utilization", description: "Current risk exposure vs defined risk appetite", calculationMethod: "Current risk level / Risk appetite threshold × 100", unit: "%", dataSource: "Enterprise risk management", category: "Risk management", complexity: "advanced", dataAvailability: "complex" },
  ],
  "Customer performance": [
    { name: "Customer satisfaction score (CSAT)", description: "Average customer satisfaction rating", calculationMethod: "Sum of satisfaction ratings / Number of responses", unit: "Score", dataSource: "Customer surveys", category: "Customer performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Net Promoter Score (NPS)", description: "Likelihood of customers recommending the company", calculationMethod: "% Promoters − % Detractors", unit: "Score", dataSource: "NPS surveys", category: "Customer performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Customer retention rate", description: "Percentage of customers retained over a period", calculationMethod: "(End customers − New customers) / Start customers × 100", unit: "%", dataSource: "CRM system", category: "Customer performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Customer acquisition cost (CAC)", description: "Average cost to acquire a new customer", calculationMethod: "Total acquisition spend / New customers acquired", unit: "Currency", dataSource: "Marketing / financial data", category: "Customer performance", complexity: "basic", dataAvailability: "moderate" },
    { name: "Customer lifetime value (CLV)", description: "Predicted total revenue from a customer", calculationMethod: "Average purchase value × Frequency × Lifespan", unit: "Currency", dataSource: "CRM / financial data", category: "Customer performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Complaint resolution time", description: "Average time to resolve customer complaints", calculationMethod: "Total resolution time / Number of complaints", unit: "Hours", dataSource: "Customer support system", category: "Customer performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Customer churn rate", description: "Percentage of customers lost over a period", calculationMethod: "Lost customers / Total customers at start × 100", unit: "%", dataSource: "CRM system", category: "Customer performance", complexity: "basic", dataAvailability: "easy" },
  ],
};

// Sector-specific KPI modifiers — adds a few unique KPIs per sector
const sectorSpecificKPIs: Record<string, KPI[]> = {
  Manufacturing: [
    { name: "Scrap rate", description: "Percentage of raw materials wasted in production", calculationMethod: "Scrap weight / Total material input × 100", unit: "%", dataSource: "Production records", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Mean time between failures (MTBF)", description: "Average time between equipment breakdowns", calculationMethod: "Total operating time / Number of failures", unit: "Hours", dataSource: "Maintenance system", category: "Operational performance", complexity: "advanced", dataAvailability: "moderate" },
  ],
  Agriculture: [
    { name: "Crop yield per hectare", description: "Agricultural output per unit of land", calculationMethod: "Total harvest / Cultivated area", unit: "Tonnes/ha", dataSource: "Farm records", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Water use efficiency", description: "Crop output per unit of water consumed", calculationMethod: "Crop yield / Water consumed", unit: "kg/m³", dataSource: "Irrigation records", category: "Environmental impact", complexity: "basic", dataAvailability: "moderate" },
  ],
  Retail: [
    { name: "Sales per square foot", description: "Revenue generated per unit of retail space", calculationMethod: "Total sales / Total selling area", unit: "Currency/ft²", dataSource: "POS / property data", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Shrinkage rate", description: "Loss of inventory due to theft, damage, or errors", calculationMethod: "Lost inventory value / Total inventory value × 100", unit: "%", dataSource: "Inventory audit", category: "Operational performance", complexity: "basic", dataAvailability: "moderate" },
  ],
  Energy: [
    { name: "Grid reliability index", description: "Percentage of time the grid is operational", calculationMethod: "Uptime hours / Total hours × 100", unit: "%", dataSource: "Grid monitoring system", category: "Operational performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Levelized cost of energy (LCOE)", description: "Average cost of energy generation over lifetime", calculationMethod: "Total lifecycle costs / Total energy produced", unit: "Currency/MWh", dataSource: "Financial / engineering data", category: "Financial performance", complexity: "advanced", dataAvailability: "complex" },
  ],
  Technology: [
    { name: "System uptime", description: "Percentage of time systems are operational", calculationMethod: "Uptime / (Uptime + Downtime) × 100", unit: "%", dataSource: "Monitoring tools", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Sprint velocity", description: "Amount of work completed per sprint", calculationMethod: "Sum of story points completed per sprint", unit: "Points", dataSource: "Project management tool", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
  ],
  Finance: [
    { name: "Non-performing loan ratio", description: "Percentage of loans in default or near default", calculationMethod: "Non-performing loans / Total loans × 100", unit: "%", dataSource: "Loan management system", category: "Risk management", complexity: "advanced", dataAvailability: "easy" },
    { name: "Cost-to-income ratio", description: "Operating costs relative to operating income", calculationMethod: "Operating costs / Operating income × 100", unit: "%", dataSource: "Financial statements", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
  ],
  Healthcare: [
    { name: "Patient readmission rate", description: "Percentage of patients readmitted within 30 days", calculationMethod: "Readmissions / Total discharges × 100", unit: "%", dataSource: "Patient records system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Bed occupancy rate", description: "Percentage of hospital beds in use", calculationMethod: "Occupied beds / Total beds × 100", unit: "%", dataSource: "Hospital management system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
  ],
  Construction: [
    { name: "Project schedule variance", description: "Deviation from planned project timeline", calculationMethod: "(Planned duration − Actual duration) / Planned duration × 100", unit: "%", dataSource: "Project management system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Cost overrun percentage", description: "Amount by which actual costs exceed budget", calculationMethod: "(Actual cost − Budget) / Budget × 100", unit: "%", dataSource: "Cost tracking system", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
  ],
  Mining: [
    { name: "Ore recovery rate", description: "Percentage of valuable material extracted", calculationMethod: "Recovered ore / Total ore processed × 100", unit: "%", dataSource: "Processing plant data", category: "Operational performance", complexity: "advanced", dataAvailability: "moderate" },
    { name: "Tailings management index", description: "Effectiveness of mine waste management", calculationMethod: "Composite score across safety, environmental, and volume metrics", unit: "Score", dataSource: "Environmental monitoring", category: "Environmental impact", complexity: "advanced", dataAvailability: "complex" },
  ],
  Logistics: [
    { name: "Fleet utilization rate", description: "Percentage of fleet capacity being used", calculationMethod: "Used capacity / Total capacity × 100", unit: "%", dataSource: "Fleet management system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Cost per kilometer", description: "Transportation cost per distance unit", calculationMethod: "Total transport costs / Total kilometers", unit: "Currency/km", dataSource: "Transport management system", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
  ],
  "Food & Beverage": [
    { name: "Food safety incident rate", description: "Number of food safety incidents per production volume", calculationMethod: "Incidents / Total batches × 100", unit: "%", dataSource: "Quality management system", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Food waste percentage", description: "Proportion of food wasted in production", calculationMethod: "Wasted food / Total food processed × 100", unit: "%", dataSource: "Production records", category: "Environmental impact", complexity: "basic", dataAvailability: "moderate" },
  ],
  "Nonprofit / Development": [
    { name: "Beneficiary reach rate", description: "Number of beneficiaries served relative to target", calculationMethod: "Actual beneficiaries / Target beneficiaries × 100", unit: "%", dataSource: "Program monitoring data", category: "Operational performance", complexity: "basic", dataAvailability: "easy" },
    { name: "Program cost efficiency", description: "Cost per beneficiary served", calculationMethod: "Total program cost / Number of beneficiaries", unit: "Currency", dataSource: "Financial / program data", category: "Financial performance", complexity: "basic", dataAvailability: "easy" },
  ],
};

export function getKPIsForSectorAndCategories(
  sector: string,
  categories: KPICategory[]
): KPI[] {
  const results: KPI[] = [];

  // Add category-based KPIs
  for (const cat of categories) {
    const kpis = categoryKPIs[cat];
    if (kpis) {
      results.push(...kpis);
    }
  }

  // Add sector-specific KPIs that match selected categories
  const sectorKPIs = sectorSpecificKPIs[sector] || [];
  for (const kpi of sectorKPIs) {
    if (categories.includes(kpi.category)) {
      results.push(kpi);
    }
  }

  return results;
}
