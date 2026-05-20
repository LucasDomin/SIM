import { useEffect, useState } from "react";

export default function PageTransition({ pageKey }: { pageKey: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, [pageKey]);

  return (
    <div className={`fixed inset-0 z-[90] pointer-events-none ${show ? "" : "hidden"}`}>
      <div className="absolute inset-0 flex">
        <div className={`flex-1 bg-noir-950 ${show ? "animate-[curtain-out_900ms_cubic-bezier(0.7,0,0.3,1)_forwards]" : ""}`} />
        <div className={`flex-1 bg-noir-950 ${show ? "animate-[curtain-out2_900ms_cubic-bezier(0.7,0,0.3,1)_forwards]" : ""}`} />
      </div>
      <style>{`
        @keyframes curtain-out  { 0%{transform:translateY(0)} 100%{transform:translateY(-100%)} }
        @keyframes curtain-out2 { 0%{transform:translateY(0)} 100%{transform:translateY(100%)} }
      `}</style>
    </div>
  );
}
