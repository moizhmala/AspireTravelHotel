module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/TravelHotel/src/utils/config.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>getKontentConfig
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$dotenv$29$__ = __turbopack_context__.i("[externals]/dotenv [external] (dotenv, cjs, [project]/TravelHotel/node_modules/dotenv)");
;
__TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$dotenv$29$__["default"].config();
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
}),
"[project]/TravelHotel/src/pages/api/languages.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/TravelHotel/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$src$2f$utils$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/TravelHotel/src/utils/config.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
//import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
async function getLanguages(headers) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$src$2f$utils$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    const url = `${config._DELIVERY_BASE_URL}/${config.projectId}/languages`;
    let response;
    try {
        response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$TravelHotel$2f$node_modules$2f$axios$29$__["default"].get(url, {
            headers
        });
        return response;
    } catch (error) {
        console.error("Error fetching languages:", error?.message || error);
        return null;
    }
}
async function handler(req, res) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$TravelHotel$2f$src$2f$utils$2f$config$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method Not Allowed"
        });
    }
    try {
        let consolidatedData = [];
        let fetchData = true;
        let headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${config.deliveryApiKey}`
        };
        while(fetchData){
            const tempData = await getLanguages(headers);
            const languages = tempData?.data?.languages;
            if (languages && languages.length > 0) {
                consolidatedData.push(...languages);
            }
            const continuation = tempData?.data?.pagination?.continuation_token;
            if (continuation) {
                headers["x-continuation"] = continuation;
            } else {
                fetchData = false;
            }
        }
        if (!consolidatedData.length) {
            return res.status(404).json({
                message: "No languages found."
            });
        }
        // Filter and sort the languages
        const filteredLanguages = consolidatedData.filter((lang)=>lang?.system?.name && lang?.system?.codename).sort((a, b)=>a.system.name.localeCompare(b.system.name)).map((lang)=>({
                name: lang.system.name,
                codename: lang.system.codename
            }));
        return res.status(200).json({
            languages: filteredLanguages
        });
    } catch (error) {
        console.error("Error fetching languages:", error?.message || error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__202146a9._.js.map