import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectInfo, ME_SECTORS, SECTOR_ICONS } from "@/data/meTypes";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface ProjectInfoFormProps {
  info: ProjectInfo;
  onChange: (info: ProjectInfo) => void;
  onNext: () => void;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Bangladesh",
  "Benin", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Burkina Faso",
  "Burundi", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile",
  "Colombia", "Comoros", "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Côte d'Ivoire",
  "Cuba", "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Eritrea", "Eswatini", "Ethiopia", "Fiji", "Gambia", "Georgia", "Ghana", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "India", "Indonesia",
  "Iraq", "Jamaica", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kyrgyzstan",
  "Laos", "Lebanon", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Malaysia",
  "Mali", "Marshall Islands", "Mauritania", "Mexico", "Micronesia", "Moldova",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
  "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Pakistan", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Rwanda",
  "Samoa", "São Tomé and Príncipe", "Senegal", "Serbia", "Sierra Leone",
  "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Sri Lanka", "Sudan",
  "Suriname", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

const ProjectInfoForm = ({ info, onChange, onNext }: ProjectInfoFormProps) => {
  const update = (field: keyof ProjectInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  const handleNext = () => {
    if (!info.organizationName.trim()) {
      toast.error("Please enter your organization name.");
      return;
    }
    if (!info.projectName.trim()) {
      toast.error("Please enter your project name.");
      return;
    }
    if (!info.country) {
      toast.error("Please select a country.");
      return;
    }
    if (!info.sector) {
      toast.error("Please select a sector.");
      return;
    }
    onNext();
  };

  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Details</CardTitle>
          <CardDescription>Provide basic information about your M&E project</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="orgName">Organization Name <span className="text-destructive">*</span></Label>
            <Input
              id="orgName"
              placeholder="e.g., UNICEF, World Vision, Save the Children"
              value={info.organizationName}
              onChange={e => update("organizationName", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="projName">Project Name <span className="text-destructive">*</span></Label>
            <Input
              id="projName"
              placeholder="e.g., Rural Water Access Improvement Program"
              value={info.projectName}
              onChange={e => update("projectName", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Country of Implementation <span className="text-destructive">*</span></Label>
            <Select value={info.country} onValueChange={v => update("country", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country..." />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {COUNTRIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Sector <span className="text-destructive">*</span></Label>
            <Select value={info.sector} onValueChange={v => update("sector", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector..." />
              </SelectTrigger>
              <SelectContent>
                {ME_SECTORS.map(s => (
                  <SelectItem key={s} value={s}>
                    <span className="mr-2">{SECTOR_ICONS[s]}</span>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Details</CardTitle>
          <CardDescription>Optional information to refine your indicators</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="subSector">Sub-sector / Thematic Focus</Label>
            <Input
              id="subSector"
              placeholder="e.g., Maternal Health, Primary Education, Climate Adaptation"
              value={info.subSector}
              onChange={e => update("subSector", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Project Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 3 years (2024–2027)"
              value={info.projectDuration}
              onChange={e => update("projectDuration", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target">Target Population</Label>
            <Input
              id="target"
              placeholder="e.g., 50,000 rural households in Northern Province"
              value={info.targetPopulation}
              onChange={e => update("targetPopulation", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleNext} className="px-8 text-base font-semibold">
          Generate Indicators
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectInfoForm;
