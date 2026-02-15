import type { NextApiRequest, NextApiResponse } from "next";
import getKontentConfig from "@/utils/config";

import { fetchLanguages } from "./helpers/fetchLanguages";
import { fetchItemsByLanguage } from "./helpers/fetchItemsByLanguage";
import { convertToCsv } from "./helpers/csv";
import {
  setExportProgress,
  resetExportProgress,
} from "./exportProgressStore";


/**
 * Each row = one content item
 * Each column = one language codename
 */
interface RowData {
  codename: string;
  [languageCodename: string]: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { environment, queryParams } = req.body;

  if (!environment || !["dev", "prod"].includes(environment)) {
    return res.status(400).json({ error: "Invalid environment" });
  }

  const systemType = queryParams?.["system.type"];
  if (!systemType || systemType.trim() === "") {
    return res
      .status(400)
      .json({ error: "system.type is required" });
  }

  const config = getKontentConfig();

  const {
    projectId,
    deliveryApiKey,
    _DELIVERY_BASE_URL,
    apiKey,
    baseUrl
  } = config;

  try {
    /**
     * 1. Fetch all languages (Management API)
     */
    const languages: string[] = await fetchLanguages(
      projectId,
      baseUrl,
      apiKey
    );
    console.log("Fetched languages:", languages);

    // 2️⃣ Fetch base items ONCE (default language)
const baseItems = await fetchItemsByLanguage({
    projectId,
    deliveryBaseUrl: _DELIVERY_BASE_URL,
    deliveryApiKey,
    systemType,
    language: "default",
});
// Check base items for the type being exported
console.log(`Fetched ${baseItems.length} base items for system.type ${systemType}`);

// 3️⃣ Initialize rows map
const IntialRows: Record<string, Record<string, string>> = {};

baseItems.forEach(item => {
  if (item.system && item.system.codename) {
    IntialRows[item.system.codename] = {};
  }
});

// ✅ 4️⃣ PROGRESS TRACKING INITIALIZATION (HERE)
const totalSteps = languages.length * baseItems.length;
let completedSteps = 0;

// Reset progress before loop
resetExportProgress();
setExportProgress(1);

    /**
     * 2. Row accumulator (keyed by item codename)
     */
    const rows: Record<string, RowData> = {};


    /**
     * 3. Fetch items language-by-language (Delivery API)
     */
    for (const language of languages) {
      const items = await fetchItemsByLanguage({
        projectId,
        deliveryApiKey,
        deliveryBaseUrl: _DELIVERY_BASE_URL,
        systemType,
        language,
        });


      for (const item of items) {
        const codename = item.system?.codename;
        if (!codename) continue;

        if (!rows[codename]) {
          rows[codename] = { codename };
        }

        rows[codename][language] =
          item.elements?.title?.value ?? "";

        // ✅ UPDATE PROGRESS HERE
        //console.log(`Processed item ${codename} for language ${language} with completedSteps ${completedSteps} of ${totalSteps}`);
        completedSteps++;
        const percent = Math.round(
        (completedSteps / totalSteps) * 100
        );
        setExportProgress(percent);

      }
    }
    // 6️⃣ Ensure completion
    setExportProgress(100);

    const data: RowData[] = Object.values(rows);
    // Check the data length before generating CSV
    console.log("Total rows to export:", data.length);

    if (data.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    /**
     * 4. Generate CSV (UTF-8 BOM for Excel)
     */
    const csvContent = "\uFEFF" + convertToCsv(data);
    const buffer = Buffer.from(csvContent, "utf-8");

    const safeType = systemType
      .replace(/[\\/:*?"<>|+ ]/g, "_")
      .toLowerCase();

    const fileName = `TravelHotel_${environment}_${safeType}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    return res.status(200).send(buffer);
  } catch (error: any) {
    console.error("Export error:", error);
    return res
      .status(500)
      .json({ error: "Failed to export CSV" });
  }
}
