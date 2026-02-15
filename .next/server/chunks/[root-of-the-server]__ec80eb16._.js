module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/dotenv [external] (dotenv, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("dotenv", () => require("dotenv"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[project]/src/utils/config.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>getKontentConfig)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/dotenv [external] (dotenv, cjs)");
;
__TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$29$__["default"].config();
const config = {
    projectId: (process.env.ENV === "prod" ? process.env.KONTENT_PROD_PROJECT_ID : process.env.KONTENT_DEV_PROJECT_ID) || "",
    apiKey: (process.env.ENV === "prod" ? process.env.KONTENT_PROD_MANAGEMENT_API_KEY : process.env.KONTENT_DEV_MANAGEMENT_API_KEY) || "",
    deliveryApiKey: (process.env.ENV === "prod" ? process.env.KONTENT_PROD_DELIVERY_API_KEY : process.env.KONTENT_DEV_DELIVERY_API_KEY) || "",
    baseUrl: (process.env.ENV === "prod" ? process.env.KONTENT_PROD_BASE_URL : process.env.KONTENT_DEV_BASE_URL) || "",
    _DELIVERY_BASE_URL: (process.env.ENV === "prod" ? process.env.KONTENT_PROD_DELIVERY_BASE_URL : process.env.KONTENT_DEV_DELIVERY_BASE_URL) || "https://deliver.kontent.ai",
    contentTypeCodename: process.env.CONTENT_TYPE_CODENAME || ""
};
function getKontentConfig() {
    __turbopack_context__.r("[externals]/fs [external] (fs, cjs)").appendFileSync("debug.txt", `Using config: ${JSON.stringify(config)}` + "\n");
    return config;
}
}}),
"[externals]/axios [external] (axios, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/pages/api/helpers/fetchLanguages.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "fetchLanguages": (()=>fetchLanguages)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
async function fetchLanguages(projectId, baseUrl, apiKey) {
    const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${baseUrl}/${projectId}/languages`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    return response.data.languages.map((lang)=>lang.codename);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/api/helpers/fetchItemsByLanguage.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "fetchItemsByLanguage": (()=>fetchItemsByLanguage)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
async function fetchItemsByLanguage(params) {
    const { projectId, deliveryApiKey, deliveryBaseUrl, systemType, language } = params;
    const allItems = [];
    let continuationToken = undefined;
    do {
        const headers = {
            Authorization: `Bearer ${deliveryApiKey}`
        };
        if (continuationToken) {
            headers["x-continuation"] = continuationToken;
        }
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${deliveryBaseUrl}/${projectId}/items`, {
            headers,
            params: {
                "system.type": systemType,
                language
            }
        });
        const data = response.data;
        if (Array.isArray(data.items)) {
            allItems.push(...data.items);
        }
        continuationToken = data.continuationToken;
    }while (continuationToken)
    return allItems;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/api/helpers/csv.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "convertToCsv": (()=>convertToCsv)
});
function convertToCsv(rows) {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    return [
        headers.join(","),
        ...rows.map((r)=>headers.map((h)=>`"${r[h] || ""}"`).join(","))
    ].join("\n");
}
}}),
"[project]/src/pages/api/exportProgressStore.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getExportProgress": (()=>getExportProgress),
    "resetExportProgress": (()=>resetExportProgress),
    "setExportProgress": (()=>setExportProgress)
});
let progress = 0;
function setExportProgress(value) {
    progress = Math.max(0, Math.min(100, value));
}
function getExportProgress() {
    return progress;
}
function resetExportProgress() {
    progress = 0;
}
}}),
"[project]/src/pages/api/exportCSVList.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/config.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchLanguages$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/helpers/fetchLanguages.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchItemsByLanguage$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/helpers/fetchItemsByLanguage.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$csv$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/helpers/csv.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportProgressStore$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/exportProgressStore.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchLanguages$2e$ts__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchItemsByLanguage$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchLanguages$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchItemsByLanguage$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { environment, queryParams } = req.body;
    if (!environment || ![
        "dev",
        "prod"
    ].includes(environment)) {
        return res.status(400).json({
            error: "Invalid environment"
        });
    }
    const systemType = queryParams?.["system.type"];
    if (!systemType || systemType.trim() === "") {
        return res.status(400).json({
            error: "system.type is required"
        });
    }
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    const { projectId, deliveryApiKey, _DELIVERY_BASE_URL, apiKey, baseUrl } = config;
    try {
        /**
     * 1. Fetch all languages (Management API)
     */ const languages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchLanguages$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["fetchLanguages"])(projectId, baseUrl, apiKey);
        console.log("Fetched languages:", languages);
        // 2️⃣ Fetch base items ONCE (default language)
        const baseItems = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchItemsByLanguage$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["fetchItemsByLanguage"])({
            projectId,
            deliveryBaseUrl: _DELIVERY_BASE_URL,
            deliveryApiKey,
            systemType,
            language: "default"
        });
        // Check base items for the type being exported
        console.log(`Fetched ${baseItems.length} base items for system.type ${systemType}`);
        // 3️⃣ Initialize rows map
        const IntialRows = {};
        baseItems.forEach((item)=>{
            if (item.system && item.system.codename) {
                IntialRows[item.system.codename] = {};
            }
        });
        // ✅ 4️⃣ PROGRESS TRACKING INITIALIZATION (HERE)
        const totalSteps = languages.length * baseItems.length;
        let completedSteps = 0;
        // Reset progress before loop
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportProgressStore$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["resetExportProgress"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportProgressStore$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setExportProgress"])(1);
        /**
     * 2. Row accumulator (keyed by item codename)
     */ const rows = {};
        /**
     * 3. Fetch items language-by-language (Delivery API)
     */ for (const language of languages){
            const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$fetchItemsByLanguage$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["fetchItemsByLanguage"])({
                projectId,
                deliveryApiKey,
                deliveryBaseUrl: _DELIVERY_BASE_URL,
                systemType,
                language
            });
            for (const item of items){
                const codename = item.system?.codename;
                if (!codename) continue;
                if (!rows[codename]) {
                    rows[codename] = {
                        codename
                    };
                }
                rows[codename][language] = item.elements?.title?.value ?? "";
                // ✅ UPDATE PROGRESS HERE
                //console.log(`Processed item ${codename} for language ${language} with completedSteps ${completedSteps} of ${totalSteps}`);
                completedSteps++;
                const percent = Math.round(completedSteps / totalSteps * 100);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportProgressStore$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setExportProgress"])(percent);
            }
        }
        // 6️⃣ Ensure completion
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportProgressStore$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setExportProgress"])(100);
        const data = Object.values(rows);
        // Check the data length before generating CSV
        console.log("Total rows to export:", data.length);
        if (data.length === 0) {
            return res.status(404).json({
                error: "No data found"
            });
        }
        /**
     * 4. Generate CSV (UTF-8 BOM for Excel)
     */ const csvContent = "\uFEFF" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$helpers$2f$csv$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["convertToCsv"])(data);
        const buffer = Buffer.from(csvContent, "utf-8");
        const safeType = systemType.replace(/[\\/:*?"<>|+ ]/g, "_").toLowerCase();
        const fileName = `TravelHotel_${environment}_${safeType}.csv`;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.status(200).send(buffer);
    } catch (error) {
        console.error("Export error:", error);
        return res.status(500).json({
            error: "Failed to export CSV"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/src/pages/api/exportCSVList.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/exportCSVList.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/exportCSVList",
        pathname: "/api/exportCSVList",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$exportCSVList$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ec80eb16._.js.map