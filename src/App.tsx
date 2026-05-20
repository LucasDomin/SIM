import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import WorkGrid from "./components/WorkGrid";
import Manifesto from "./components/Manifesto";
import Services from "./components/Services";
import AIAgent from "./components/AIAgent";
import Estimate from "./components/Estimate";
import Footer from "./components/Footer";
import CaseStudy from "./components/CaseStudy";
import WhatsAppFab from "./components/WhatsAppFab";
import Dashboard from "./components/Dashboard";
import StudioPage from "./components/StudioPage";
import PageTransition from "./components/PageTransition";
import type { Project } from "./data/projects";

type Page = "home" | "work" | "studio" | "estimate" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <div className="grain min-h-screen bg-noir-950 text-noir-100 selection:bg-accent selection:text-noir-900">
      {/* Boot loader */}
      {!booted && <BootLoader />}

      <Nav onNavigate={navigate} current={page} />
      <PageTransition pageKey={page} />

      <main>
        {page === "home" && (
          <>
            <Hero onCTA={navigate} />
            <Marquee />
            <WorkGrid onOpen={setActiveProject} variant="home" />
            <Manifesto />
            <Services />
            <AIAgent />
            <Estimate />
          </>
        )}

        {page === "work" && (
          <div className="pt-24">
            <WorkGrid onOpen={setActiveProject} variant="full" />
          </div>
        )}

        {page === "studio" && <StudioPage />}

        {page === "estimate" && (
          <div className="pt-20">
            <Estimate />
            <AIAgent />
          </div>
        )}

        {page === "dashboard" && <Dashboard />}
      </main>

      <Footer onNavigate={navigate} />

      <CaseStudy project={activeProject} onClose={() => setActiveProject(null)} />
      <WhatsAppFab />
    </div>
  );
}

function BootLoader() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const i = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 1900);
      setProgress(p);
      if (p >= 1) clearInterval(i);
    }, 30);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-noir-950 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity: progress >= 1 ? 0 : 1, pointerEvents: progress >= 1 ? "none" : "auto" }}
    >
      <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400">
        MOMENTUM · Loading reel
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400">
        {Math.round(progress * 100).toString().padStart(3, "0")} %
      </div>

      <div className="w-[180px] h-[180px] relative">
        <div className="absolute inset-0 animate-aperture">
          <svg viewBox="0 0 180 180" className="w-full h-full">
            <circle cx="90" cy="90" r="78" fill="none" stroke="#3a3a40" strokeWidth="0.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line
                key={a}
                x1="90" y1="90"
                x2={90 + 70 * Math.cos((a * Math.PI) / 180)}
                y2={90 + 70 * Math.sin((a * Math.PI) / 180)}
                stroke="#3a3a40" strokeWidth="0.5"
              />
            ))}
            <circle cx="90" cy="90" r="40" fill="none" stroke="#d4c5a9" strokeWidth="0.8"
              strokeDasharray={`${progress * 251} 999`} transform="rotate(-90 90 90)" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display italic text-5xl text-noir-50">M<span className="text-accent">.</span></span>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[260px]">
        <div className="h-px bg-noir-700 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-400 text-center mt-3">
          Cinematic Studio · Est. 2017
        </div>
      </div>
    </div>
  );
}
