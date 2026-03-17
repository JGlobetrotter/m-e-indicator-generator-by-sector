import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MEIndicator, SelectedIndicator, ProjectInfo, FREQUENCY_OPTIONS, INDICATOR_CATEGORIES, IndicatorCategory, SECTOR_ICONS } from "@/data/meTypes";
import { getIndicatorsForSector } from "@/data/meDatabase";
import { exportMEToCSV, exportMEToExcel, copyMEToClipboard } from "@/lib/meExportUtils";
import { ArrowLeft, Copy, FileSpreadsheet, FileText, Download, Search, Plus, X, Mail } from "lucide-react";

interface IndicatorResultsProps {
  projectInfo: ProjectInfo;
  onBack: () => void;
}

const CATEGORY_COLORS: Record<IndicatorCategory, string> = {
  "Output": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Outcome": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Impact": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const IndicatorResults = ({ projectInfo, onBack }: IndicatorResultsProps) => {
  const allIndicators = useMemo(() => getIndicatorsForSector(projectInfo.sector), [projectInfo.sector]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndicator, setEditingIndicator] = useState<string | null>(null);
  const [customIndicators, setCustomIndicators] = useState<SelectedIndicator[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ title: "", definition: "", method: "", unit: "", source: "" });

  // Baseline & target values
  const [indicatorExtras, setIndicatorExtras] = useState<Record<string, { baseline: string; target: string; frequency: string }>>({});

  // Export gating
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(() => !!localStorage.getItem("me_email"));

  const filteredIndicators = useMemo(() => {
    return allIndicators.filter(ind => {
      if (filterCategory !== "all" && ind.category !== filterCategory) return false;
      if (searchTerm && !ind.title.toLowerCase().includes(searchTerm.toLowerCase()) && !ind.definition.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [allIndicators, filterCategory, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const ids = filteredIndicators.map(i => i.id);
    setSelectedIds(prev => {
      const next = new Set(prev);
      const allSelected = ids.every(id => next.has(id));
      if (allSelected) { ids.forEach(id => next.delete(id)); }
      else { ids.forEach(id => next.add(id)); }
      return next;
    });
  };

  const updateExtra = (id: string, field: "baseline" | "target" | "frequency", value: string) => {
    setIndicatorExtras(prev => ({
      ...prev,
      [id]: { ...prev[id], baseline: prev[id]?.baseline || "", target: prev[id]?.target || "", frequency: prev[id]?.frequency || "", [field]: value },
    }));
  };

  const addCustomIndicator = () => {
    if (!customForm.title.trim()) { toast.error("Please enter an indicator title."); return; }
    const newInd: SelectedIndicator = {
      id: `custom-${Date.now()}`,
      title: customForm.title,
      definition: customForm.definition || "Custom indicator",
      measurementMethod: customForm.method || "To be defined",
      unit: customForm.unit || "Number",
      frequency: "quarterly",
      suggestedDataSource: customForm.source || "Project records",
      frameworkSource: "Custom",
      sector: projectInfo.sector as any,
      category: "Output",
      baseline: "",
      target: "",
      customFrequency: "quarterly",
    };
    setCustomIndicators(prev => [...prev, newInd]);
    setSelectedIds(prev => new Set(prev).add(newInd.id));
    setCustomForm({ title: "", definition: "", method: "", unit: "", source: "" });
    setShowCustomForm(false);
    toast.success("Custom indicator added.");
  };

  const getSelectedIndicators = (): SelectedIndicator[] => {
    const fromDB = allIndicators.filter(i => selectedIds.has(i.id)).map(i => ({
      ...i,
      baseline: indicatorExtras[i.id]?.baseline || "",
      target: indicatorExtras[i.id]?.target || "",
      customFrequency: (indicatorExtras[i.id]?.frequency || i.frequency) as any,
    }));
    const fromCustom = customIndicators.filter(i => selectedIds.has(i.id));
    return [...fromDB, ...fromCustom];
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) { toast.error("Please enter a valid email address."); return; }
    localStorage.setItem("me_email", email);
    setEmailSubmitted(true);
    toast.success("Thank you! You can now export your indicator framework.");
  };

  const handleExportCSV = () => exportMEToCSV(getSelectedIndicators(), projectInfo);
  const handleExportExcel = () => exportMEToExcel(getSelectedIndicators(), projectInfo);
  const handleCopy = () => { copyMEToClipboard(getSelectedIndicators()).then(() => toast.success("Indicators copied to clipboard!")); };

  const selectedCount = selectedIds.size;

  return (
    <div className="grid gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to project info
          </Button>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span>{SECTOR_ICONS[projectInfo.sector as keyof typeof SECTOR_ICONS]}</span>
            {projectInfo.sector} Indicators
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {projectInfo.projectName} — {projectInfo.organizationName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm py-1 px-3">
            {selectedCount} selected
          </Badge>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={selectedCount === 0}>
            <Copy className="mr-1.5 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Search indicators</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or definition..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {INDICATOR_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCustomForm(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add custom
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom indicator form */}
      {showCustomForm && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Add Custom Indicator</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowCustomForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Indicator title *" value={customForm.title} onChange={e => setCustomForm(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Unit (e.g., %, Number)" value={customForm.unit} onChange={e => setCustomForm(p => ({ ...p, unit: e.target.value }))} />
            <Input placeholder="Definition" className="sm:col-span-2" value={customForm.definition} onChange={e => setCustomForm(p => ({ ...p, definition: e.target.value }))} />
            <Input placeholder="Measurement method" value={customForm.method} onChange={e => setCustomForm(p => ({ ...p, method: e.target.value }))} />
            <Input placeholder="Data source" value={customForm.source} onChange={e => setCustomForm(p => ({ ...p, source: e.target.value }))} />
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={addCustomIndicator}>Add Indicator</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicator table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40px]">
                    <Checkbox checked={filteredIndicators.length > 0 && filteredIndicators.every(i => selectedIds.has(i.id))} onCheckedChange={selectAll} />
                  </TableHead>
                  <TableHead className="font-semibold">Indicator</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Method</TableHead>
                  <TableHead className="font-semibold">Unit</TableHead>
                  <TableHead className="font-semibold">Frequency</TableHead>
                  <TableHead className="font-semibold">Framework</TableHead>
                  <TableHead className="font-semibold">Baseline</TableHead>
                  <TableHead className="font-semibold">Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIndicators.map((ind, i) => (
                  <TableRow key={ind.id} className={`${i % 2 === 0 ? "" : "bg-muted/20"} ${selectedIds.has(ind.id) ? "bg-primary/5" : ""}`}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(ind.id)} onCheckedChange={() => toggleSelect(ind.id)} />
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      <div className="font-medium text-foreground text-sm">{ind.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ind.definition}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[ind.category]}`}>
                        {ind.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm min-w-[140px]">{ind.measurementMethod}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs">{ind.unit}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={indicatorExtras[ind.id]?.frequency || ind.frequency}
                        onValueChange={v => updateExtra(ind.id, "frequency", v)}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCY_OPTIONS.map(f => (
                            <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">{ind.frameworkSource}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 w-[80px] text-xs"
                        placeholder="—"
                        value={indicatorExtras[ind.id]?.baseline || ""}
                        onChange={e => updateExtra(ind.id, "baseline", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 w-[80px] text-xs"
                        placeholder="—"
                        value={indicatorExtras[ind.id]?.target || ""}
                        onChange={e => updateExtra(ind.id, "target", e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Custom indicators */}
                {customIndicators.map((ind, i) => (
                  <TableRow key={ind.id} className={`${selectedIds.has(ind.id) ? "bg-primary/5" : ""} border-l-2 border-l-primary/40`}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(ind.id)} onCheckedChange={() => toggleSelect(ind.id)} />
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      <div className="font-medium text-foreground text-sm">{ind.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{ind.definition}</div>
                      <Badge variant="outline" className="text-[10px] mt-1 border-primary/30 text-primary">Custom</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[ind.category]}`}>
                        {ind.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{ind.measurementMethod}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs">{ind.unit}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{ind.frequency}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">{ind.frameworkSource}</Badge>
                    </TableCell>
                    <TableCell><Input className="h-8 w-[80px] text-xs" placeholder="—" /></TableCell>
                    <TableCell><Input className="h-8 w-[80px] text-xs" placeholder="—" /></TableCell>
                  </TableRow>
                ))}
                {filteredIndicators.length === 0 && customIndicators.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No indicators match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export section */}
      {selectedCount > 0 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Download className="h-5 w-5" />
              Export Indicator Framework
            </CardTitle>
            {!emailSubmitted && (
              <CardDescription>Enter your email to download your M&E framework.</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!emailSubmitted ? (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@organization.org"
                    className="pl-9"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                  />
                </div>
                <Button onClick={handleEmailSubmit}>Unlock Downloads</Button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                  Excel (.xlsx)
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileText className="mr-1.5 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy to clipboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IndicatorResults;
