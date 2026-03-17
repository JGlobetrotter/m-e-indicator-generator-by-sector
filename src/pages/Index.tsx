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
import { SECTORS, KPI_CATEGORIES, KPICategory, KPI } from "@/data/kpiTypes";
import { getKPIsForSectorAndCategories } from "@/data/kpiDatabase";
import { exportToCSV, exportToExcel, copyKPIsToClipboard } from "@/lib/exportUtils";
import { BarChart3, Download, Copy, FileSpreadsheet, FileText, Mail, ChevronDown } from "lucide-react";

const Index = () => {
  const [sector, setSector] = useState("");
  const [customSector, setCustomSector] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<KPICategory[]>([]);
  const [generatedKPIs, setGeneratedKPIs] = useState<KPI[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");

  // Lead magnet
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(() => !!localStorage.getItem("kpi_email"));

  const toggleCategory = (cat: KPICategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerate = () => {
    const activeSector = sector === "custom" ? customSector : sector;
    if (!activeSector || selectedCategories.length === 0) {
      toast.error("Please select a sector and at least one KPI category.");
      return;
    }
    const kpis = getKPIsForSectorAndCategories(activeSector, selectedCategories);
    setGeneratedKPIs(kpis);
    setShowResults(true);
    setFilterCategory("all");
    setFilterComplexity("all");
    setFilterAvailability("all");
  };

  const filteredKPIs = useMemo(() => {
    return generatedKPIs.filter(kpi => {
      if (filterCategory !== "all" && kpi.category !== filterCategory) return false;
      if (filterComplexity !== "all" && kpi.complexity !== filterComplexity) return false;
      if (filterAvailability !== "all" && kpi.dataAvailability !== filterAvailability) return false;
      return true;
    });
  }, [generatedKPIs, filterCategory, filterComplexity, filterAvailability]);

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    localStorage.setItem("kpi_email", email);
    setEmailSubmitted(true);
    toast.success("Thank you! You can now download your KPI framework.");
  };

  const handleExportCSV = () => exportToCSV(filteredKPIs);
  const handleExportExcel = () => exportToExcel(filteredKPIs);
  const handleCopy = () => {
    copyKPIsToClipboard(filteredKPIs).then(() => toast.success("KPI list copied to clipboard!"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <BarChart3 className="h-4 w-4" />
            Performance Framework Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            KPI Generator by Sector
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate relevant key performance indicators tailored to specific industries and operational contexts.
            This tool helps teams quickly identify metrics for monitoring performance, sustainability initiatives,
            compliance, or operational improvement.
          </p>
        </div>
      </section>

      {/* Selection */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-8">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <div>
                  <CardTitle className="text-lg">Select Sector</CardTitle>
                  <CardDescription>Choose the industry or enter a custom sector</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Choose a sector..." />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom sector...</SelectItem>
                </SelectContent>
              </Select>
              {sector === "custom" && (
                <Input
                  className="mt-3 max-w-sm"
                  placeholder="Enter your sector..."
                  value={customSector}
                  onChange={e => setCustomSector(e.target.value)}
                />
              )}
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                <div>
                  <CardTitle className="text-lg">Select KPI Categories</CardTitle>
                  <CardDescription>Choose one or more categories to generate indicators</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {KPI_CATEGORIES.map(cat => (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 rounded-lg border border-border p-3 cursor-pointer transition-colors hover:bg-secondary data-[checked=true]:border-primary data-[checked=true]:bg-primary/5"
                    data-checked={selectedCategories.includes(cat)}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <span className="text-sm font-medium text-foreground">{cat}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate */}
          <div className="flex justify-center">
            <Button size="lg" onClick={handleGenerate} className="px-10 text-base font-semibold">
              <BarChart3 className="mr-2 h-5 w-5" />
              Generate KPIs
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      {showResults && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Generated KPIs</CardTitle>
                  <CardDescription>{filteredKPIs.length} indicators found</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy to clipboard
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Category:</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-8 w-[180px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {selectedCategories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Complexity:</Label>
                  <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Data availability:</Label>
                  <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">KPI Name</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Calculation</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold">Data Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKPIs.map((kpi, i) => (
                      <TableRow key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                        <TableCell className="font-medium text-foreground whitespace-nowrap">{kpi.name}</TableCell>
                        <TableCell className="text-muted-foreground min-w-[200px]">{kpi.description}</TableCell>
                        <TableCell className="text-muted-foreground min-w-[180px]">{kpi.calculationMethod}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{kpi.unit}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{kpi.dataSource}</TableCell>
                      </TableRow>
                    ))}
                    {filteredKPIs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No KPIs match the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Lead Magnet + Export */}
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Download className="h-5 w-5" />
                Download KPI List
              </CardTitle>
              {!emailSubmitted && (
                <CardDescription>Enter your email to export your KPI framework.</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {!emailSubmitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
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
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-sm font-semibold text-foreground">Created by <a href="https://navisignal.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Navisignal</a></p>
          <p className="text-xs text-muted-foreground mt-1">
            Decision tools for sustainability, governance, and performance strategy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
