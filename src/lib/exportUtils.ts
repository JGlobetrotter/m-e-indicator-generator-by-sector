import { KPI } from "@/data/kpiTypes";
import * as XLSX from "xlsx";

export function exportToCSV(kpis: KPI[], filename = "kpi-framework.csv") {
  const headers = ["KPI Name", "Description", "Calculation Method", "Unit", "Suggested Data Source", "Category", "Complexity", "Data Availability"];
  const rows = kpis.map(k => [k.name, k.description, k.calculationMethod, k.unit, k.dataSource, k.category, k.complexity, k.dataAvailability]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  downloadFile(csv, filename, "text/csv");
}

export function exportToExcel(kpis: KPI[], filename = "kpi-framework.xlsx") {
  const data = kpis.map(k => ({
    "KPI Name": k.name,
    "Description": k.description,
    "Calculation Method": k.calculationMethod,
    "Unit": k.unit,
    "Suggested Data Source": k.dataSource,
    "Category": k.category,
    "Complexity": k.complexity,
    "Data Availability": k.dataAvailability,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "KPIs");
  XLSX.writeFile(wb, filename);
}

export function copyKPIsToClipboard(kpis: KPI[]): Promise<void> {
  const text = kpis.map(k =>
    `${k.name}\t${k.description}\t${k.calculationMethod}\t${k.unit}\t${k.dataSource}`
  ).join("\n");
  const header = "KPI Name\tDescription\tCalculation Method\tUnit\tSuggested Data Source\n";
  return navigator.clipboard.writeText(header + text);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
