module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/TravelHotel/src/components/ExportButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExportButton",
    ()=>ExportButton
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const ExportButton = ({ environment, systemType, disabled })=>{
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const pollProgress = ()=>{
        const timer = setInterval(async ()=>{
            const res = await fetch("/api/exportProgress", {
                cache: "no-store"
            });
            const data = await res.json();
            setProgress(data.progress);
            if (data.progress >= 100) {
                clearInterval(timer);
                setIsExporting(false);
            }
        }, 1000);
    };
    const handleExport = async ()=>{
        if (!environment || !systemType) {
            alert("Please select Environment and List");
            return;
        }
        setProgress(0);
        setIsExporting(true);
        pollProgress();
        const response = await fetch("/api/exportCSVList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                environment,
                queryParams: {
                    "system.type": systemType
                }
            })
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleExport,
                disabled: disabled || isExporting,
                className: "bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50",
                children: isExporting ? "Exporting..." : "Export List"
            }, void 0, false, {
                fileName: "[project]/TravelHotel/src/components/ExportButton.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isExporting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full bg-gray-200 rounded h-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-blue-600 h-2 rounded transition-all",
                    style: {
                        width: `${progress}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/components/ExportButton.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/TravelHotel/src/components/ExportButton.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isExporting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "text-sm text-gray-600",
                children: [
                    progress,
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/components/ExportButton.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/TravelHotel/src/components/ExportButton.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/TravelHotel/src/pages/bulkuploader.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/TravelHotel/node_modules/lucide-react/dist/esm/icons/circle-alert.js [ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/TravelHotel/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/TravelHotel/node_modules/lucide-react/dist/esm/icons/upload.js [ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/TravelHotel/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$src$2f$components$2f$ExportButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/TravelHotel/src/components/ExportButton.tsx [ssr] (ecmascript)");
;
;
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    /* ---------- Global State ---------- */ const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("picklist");
    const [environment, setEnvironment] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("dev");
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [uploadResult, setUploadResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    /* ---------- Picklist State ---------- */ const [types, setTypes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [languages, setLanguages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedLanguage, setSelectedLanguage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [fetchingTypes, setFetchingTypes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [fetchingLanguages, setFetchingLanguages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    /* ---------- Header / Footer State ---------- */ const [hfType, setHfType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    /* ===================== Effects ===================== */ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setEnvironment(router.asPath === "/prod" ? "prod" : "dev");
    }, [
        router.asPath
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchTypes = async ()=>{
            try {
                const res = await fetch("/api/types");
                const data = await res.json();
                setTypes(data.types || []);
            } finally{
                setFetchingTypes(false);
            }
        };
        fetchTypes();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchLanguages = async ()=>{
            try {
                const res = await fetch("/api/languages");
                const data = await res.json();
                setLanguages(data.languages || []);
            } finally{
                setFetchingLanguages(false);
            }
        };
        fetchLanguages();
    }, []);
    /* Reset form when switching tabs */ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setFile(null);
        setErrors(null);
        setUploadResult(null);
    }, [
        activeTab
    ]);
    /* ===================== Handlers ===================== */ const handleFileChange = (e)=>{
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setErrors(null);
        }
    };
    const handleUpload = async ()=>{
        if (!file || !selectedType || !selectedLanguage) {
            setErrors("All fields are required.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("environment", environment);
        formData.append("type", selectedType);
        formData.append("language", selectedLanguage);
        setLoading(true);
        try {
            const res = await fetch("/api/uploadpicklist", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            res.ok ? setUploadResult(result) : setErrors(result.message);
        } finally{
            setLoading(false);
        }
    };
    /* TODO: Connect to your backend */ const handleHeaderFooterUpload = async ()=>{
        if (!file || !hfType) {
            setErrors("File and type are required.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("environment", environment);
        formData.append("type", hfType);
        setLoading(true);
        try {
            const res = await fetch("/api/uploadheaderfooter", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            res.ok ? setUploadResult(result) : setErrors(result.message);
        } finally{
            setLoading(false);
        }
    };
    /* ===================== Reusable UI ===================== */ const FileUpload = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
            className: "border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                    size: 32
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                    lineNumber: 147,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "mt-2 text-sm",
                    children: file ? file.name : "Upload CSV"
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                    lineNumber: 148,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                    type: "file",
                    accept: ".csv",
                    hidden: true,
                    onChange: handleFileChange
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                    lineNumber: 149,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
            lineNumber: 146,
            columnNumber: 5
        }, this);
    const EnvironmentSelect = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
            value: environment,
            onChange: (e)=>setEnvironment(e.target.value),
            className: "border p-2 rounded bg-gray-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                    value: "dev",
                    children: "Development"
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                    lineNumber: 159,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                    value: "prod",
                    children: "Production"
                }, void 0, false, {
                    fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                    lineNumber: 160,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
            lineNumber: 154,
            columnNumber: 5
        }, this);
    /* ===================== JSX ===================== */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-5xl mx-auto rounded-xl shadow",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex border-b mb-6 bg-white rounded",
                children: [
                    [
                        "picklist",
                        "Picklist Upload"
                    ],
                    [
                        "headerFooter",
                        "Header / Footer Upload"
                    ],
                    [
                        "export",
                        "Export"
                    ]
                ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(id),
                        className: `px-4 py-2 border-b-2 ${activeTab === id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`,
                        children: label
                    }, id, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            activeTab === "picklist" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6 bg-gray-500 rounded p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(FileUpload, {}, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(EnvironmentSelect, {}, void 0, false, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedType,
                                onChange: (e)=>setSelectedType(e.target.value),
                                className: "border p-2 rounded bg-gray-500",
                                disabled: fetchingTypes,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "File Type"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this),
                                    types.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: t.codename,
                                            children: t.name
                                        }, t.codename, false, {
                                            fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                            lineNumber: 204,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedLanguage,
                                onChange: (e)=>setSelectedLanguage(e.target.value),
                                className: "border p-2 rounded bg-gray-500",
                                disabled: fetchingLanguages,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Language"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this),
                                    languages.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: l.codename,
                                            children: l.name
                                        }, l.codename, false, {
                                            fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleUpload,
                        disabled: loading,
                        className: "bg-orange-500 text-white px-4 py-2 rounded",
                        children: "Upload Picklist"
                    }, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 191,
                columnNumber: 9
            }, this),
            activeTab === "headerFooter" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6 bg-gray-500 rounded p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(FileUpload, {}, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(EnvironmentSelect, {}, void 0, false, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: hfType,
                                onChange: (e)=>setHfType(e.target.value),
                                className: "border p-2 rounded bg-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Type"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "email",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "web",
                                        children: "Web"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleHeaderFooterUpload,
                        className: "bg-orange-500 text-white px-4 py-2 rounded",
                        children: "Upload Header / Footer"
                    }, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this),
            activeTab === "export" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6 bg-gray-500 rounded p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(EnvironmentSelect, {}, void 0, false, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedType,
                                onChange: (e)=>setSelectedType(e.target.value),
                                className: "border p-2 rounded bg-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "File Type"
                                    }, void 0, false, {
                                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    types.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: t.codename,
                                            children: t.name
                                        }, t.codename, false, {
                                            fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-300 mb-2 flex gap-4 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$src$2f$components$2f$ExportButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ExportButton"], {
                                environment: environment,
                                systemType: selectedType,
                                //languageCodename={selectedLanguage}
                                disabled: !selectedType
                            }, void 0, false, {
                                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                                lineNumber: 275,
                                columnNumber: 13
                            }, this),
                            " * Exported file will be in CSV format with UTF-8 encoding."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 273,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 259,
                columnNumber: 9
            }, this),
            errors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-4 flex items-center text-red-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 18,
                        className: "mr-2"
                    }, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this),
                    " ",
                    errors
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, this),
            uploadResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-6 text-green-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                        className: "inline mr-2"
                    }, void 0, false, {
                        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this),
                    uploadResult.message
                ]
            }, void 0, true, {
                fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
                lineNumber: 295,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/TravelHotel/src/pages/bulkuploader.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dac8d44f._.js.map