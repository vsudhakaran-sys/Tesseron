import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function FuelData() {
  const { t } = useLanguage();
  const powerBiUrl = import.meta.env.VITE_POWERBI_URL;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t.fuelData.title}
        </h1>
        <p className="text-slate-500 mt-1">
          {t.fuelData.description}
        </p>
      </div>

      {/* Power BI Embed */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
        
        {/* Custom Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-slate-600 font-medium">
                Loading Fuel Dashboard...
              </p>
            </div>
          </div>
        )}

        <div style={{ height: "700px", overflow: "hidden" }}>
          <iframe
            title="FleetSync"
            width="100%"
            height="750"
            src={powerBiUrl}
            frameBorder="0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            style={{ transform: "translateY(-10px)" }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}