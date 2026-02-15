// import React from "react";

// interface ExportButtonProps {
//   environment: string; // "dev" or "prod"
//   systemType: string; // e.g. "country_list"
//   languageCodename?: string;
//   disabled?: boolean;
// }

// export const ExportButton: React.FC<ExportButtonProps> = ({ environment, systemType, languageCodename, disabled }) => {
//   const handleExport = async () => {
//     if (!environment || !systemType || systemType.trim() === "") {
//         alert("Please select both Environment and File Type before exporting.");
//         return;
//       }

//     try {
//         //console.log("Exporting data for environment: " + environment + " and system type: " +systemType);
//       const response = await fetch("/api/exportList", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           environment,
//           language: languageCodename || "default",
//           queryParams: {
//             "system.type": systemType,
//           },
//         }),
        
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Export failed: ${errorData.error || "Unknown error"}`);
//         return;
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Monarch_${environment}_${systemType}.xlsx`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       alert("An error occurred during export.");
//       console.error(err);
//     }
//   };

//   return (
//       <button
//           onClick={handleExport}
//           disabled={disabled || !environment || !systemType || systemType.trim() === ""}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
//           aria-label="Export List"
//           type="button"
//       >
//           Export List
//       </button>
//   );
// };

import React, { useState } from "react";

interface ExportButtonProps {
  environment: string;
  systemType: string;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  environment,
  systemType,
  disabled,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);

  const pollProgress = () => {
    const timer = setInterval(async () => {
      const res = await fetch("/api/exportProgress", { cache: "no-store" });
      const data = await res.json();

      setProgress(data.progress);

      if (data.progress >= 100) {
        clearInterval(timer);
        setIsExporting(false);
      }
    }, 1000);
  };

  const handleExport = async () => {
    if (!environment || !systemType) {
      alert("Please select Environment and List");
      return;
    }

    setProgress(0);
    setIsExporting(true);
    pollProgress();

    const response = await fetch("/api/exportCSVList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment,
        queryParams: { "system.type": systemType },
      }),
    });

    if (!response.ok) {
      setIsExporting(false);
      alert("Export failed");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `TravelHotel_${environment}_${systemType}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isExporting ? "Exporting..." : "Export List"}
      </button>

      {isExporting && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isExporting && (
        <span className="text-sm text-gray-600">{progress}%</span>
      )}
    </div>
  );
};
