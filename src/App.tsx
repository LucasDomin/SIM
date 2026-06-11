import { useEffect, useState } from "react";
import { Logo } from "./components/Logo";
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

  // Atalho de teclado para admin: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      const p = Math.min(1, (Date.now() - start) / 2200);
      setProgress(p);
      if (p >= 1) {
        clearInterval(i);
        // pequena pausa antes de ocultar
        setTimeout(() => setProgress(2), 450);
      }
    }, 30);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-noir-950 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity: progress >= 2 ? 0 : 1, pointerEvents: progress >= 2 ? "none" : "auto" }}
    >
      <Logo className="w-64 h-auto" animated />
    </div>
  );
}
