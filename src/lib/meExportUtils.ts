import { SelectedIndicator, ProjectInfo } from "@/data/meTypes";
import * as XLSX from "xlsx";

export function exportMEToCSV(indicators: SelectedIndicator[], projectInfo: ProjectInfo, filename = "me-indicator-framework.csv") {
  const headers = [
    "Organization", "Project", "Country", "Sector",
    "Indicator", "Definition", "Measurement Method", "Unit",
    "Frequency", "Data Source", "Framework Source", "Category",
    "Baseline", "Target"
  ];
  const rows = indicators.map(i => [
    projectInfo.organizationName, projectInfo.projectName, projectInfo.country, projectInfo.sector,
    i.title, i.definition, i.measurementMethod, i.unit,
    i.customFrequency || i.frequency, i.suggestedDataSource, i.frameworkSource, i.category,
    i.baseline, i.target
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  downloadFile(csv, filename, "text/csv");
}

export function exportMEToExcel(indicators: SelectedIndicator[], projectInfo: ProjectInfo, filename = "me-indicator-framework.xlsx") {
  const data = indicators.map(i => ({
    "Organization": projectInfo.organizationName,
    "Project": projectInfo.projectName,
    "Country": projectInfo.country,
    "Sector": projectInfo.sector,
    "Indicator": i.title,
    "Definition": i.definition,
    "Measurement Method": i.measurementMethod,
    "Unit": i.unit,
    "Frequency": i.customFrequency || i.frequency,
    "Data Source": i.suggestedDataSource,
    "Framework Source": i.frameworkSource,
    "Category": i.category,
    "Baseline": i.baseline,
    "Target": i.target,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Indicators");
  XLSX.writeFile(wb, filename);
}

export function copyMEToClipboard(indicators: SelectedIndicator[]): Promise<void> {
  const header = "Indicator\tDefinition\tMethod\tUnit\tFrequency\tData Source\tFramework\tCategory\tBaseline\tTarget\n";
  const text = indicators.map(i =>
    `${i.title}\t${i.definition}\t${i.measurementMethod}\t${i.unit}\t${i.customFrequency || i.frequency}\t${i.suggestedDataSource}\t${i.frameworkSource}\t${i.category}\t${i.baseline}\t${i.target}`
  ).join("\n");
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
