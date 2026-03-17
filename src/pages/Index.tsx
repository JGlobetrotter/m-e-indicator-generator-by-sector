import { useState } from "react";
import { ProjectInfo } from "@/data/meTypes";
import StepProgress from "@/components/StepProgress";
import ProjectInfoForm from "@/components/ProjectInfoForm";
import IndicatorResults from "@/components/IndicatorResults";
import { BarChart3 } from "lucide-react";

const STEPS = ["Project Info", "Indicators"];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    organizationName: "",
    projectName: "",
    country: "",
    sector: "",
    subSector: "",
    projectDuration: "",
    targetPopulation: "",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-5">
            <BarChart3 className="h-4 w-4" />
            Monitoring &amp; Evaluation Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            M&amp;E Indicator Generator
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate evidence-based monitoring and evaluation indicators by sector, aligned with
            global frameworks including UN SDGs, USAID, World Bank, and OECD DAC standards.
          </p>
        </div>
      </section>

      {/* Progress */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <StepProgress currentStep={currentStep} steps={STEPS} />
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        {currentStep === 1 && (
          <ProjectInfoForm
            info={projectInfo}
            onChange={setProjectInfo}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <IndicatorResults
            projectInfo={projectInfo}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-sm font-semibold text-foreground">
            Created by{" "}
            <a href="https://navisignal.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Navisignal
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Decision tools for sustainability, governance, and performance strategy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
