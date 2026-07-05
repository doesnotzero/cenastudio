import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const REVEAL_DELAY_MS = 260;

export default function WorkspaceLoadingShell() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-frame-black text-frame-white" aria-busy="true">
      {visible ? (
        <div className="animate-in fade-in duration-300" role="status" aria-live="polite">
          <div className="h-[72px] border-b border-frame-gray-3 bg-frame-black">
            <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 lg:px-10">
              <span className="font-frame-mono text-xs uppercase text-frame-white">
                Cena <span className="text-frame-orange">Studio</span>
              </span>
              <div className="hidden items-center gap-5 md:flex" aria-hidden="true">
                <span className="h-2 w-14 bg-frame-gray-3/80" />
                <span className="h-2 w-20 bg-frame-gray-3/60" />
                <span className="h-2 w-16 bg-frame-gray-3/60" />
                <span className="h-8 w-8 border border-frame-gray-3 bg-frame-gray-1" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-10 lg:py-12">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div className="space-y-4" aria-hidden="true">
                <span className="block h-2 w-28 bg-frame-orange/70" />
                <span className="block h-8 w-64 max-w-[70vw] bg-frame-gray-2" />
                <span className="block h-3 w-44 bg-frame-gray-3/60" />
              </div>
              <span className="hidden h-9 w-28 border border-frame-gray-3 bg-frame-gray-1 md:block" aria-hidden="true" />
            </div>

            <div className="grid gap-4 md:grid-cols-3" aria-hidden="true">
              <span className="h-36 border border-frame-gray-3 bg-frame-gray-1/70" />
              <span className="h-36 border border-frame-gray-3 bg-frame-gray-1/55" />
              <span className="h-36 border border-frame-gray-3 bg-frame-gray-1/40" />
            </div>

            <p className="mt-6 font-frame-mono text-[0.65rem] uppercase text-frame-gray-light">
              <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse bg-frame-orange" aria-hidden="true" />
              {t("app.common.loadingWorkspace") as string}
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
