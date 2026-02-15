import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as XLSX from "xlsx";

interface RowData {
  Title?: string;
  "Country Name"?: string;
  "Country Code"?: string;
  "Country Three Letter"?: string;
  "Country Currency"?: string;
}

interface ApiResponse {
  items: [{
    system?: { 
      id?: string;
      codename?: string;
      type?: string;
    };
    elements?: {
      title?: { value?: string };
      country_title?: { value?: string };
      country_code?: { value?: string };
      country_three_letter?: { value?: string };
      country_currency?: { value?: string };
    };
  }];
  continuationToken?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { environment, queryParams, language = "default" } = req.body;

  if (!environment || !["dev", "prod"].includes(environment)) {
    return res.status(400).json({ error: "Invalid or missing environment" });
  }

  const systemType = queryParams?.["system.type"];
  if (!systemType || systemType.trim() === "") {
    return res.status(400).json({ error: "Please select a list (system.type) to export." });
  }

  // const language = queryParams?.["language"] || "default";
  // If language is not provided, use default
  // if (!language || language.trim() === "") {  
  //   queryParams["language"] = "default";
  // }

  // Fetch env vars dynamically
  const projectId = process.env[`KONTENT_${environment.toUpperCase()}_PROJECT_ID`];
  const baseUrl = process.env[`KONTENT_${environment.toUpperCase()}_DELIVERY_BASE_URL`] || "https://deliver.kontent.ai";
  const apiKey = process.env[`KONTENT_${environment.toUpperCase()}_DELIVERY_API_KEY`];

  if (!projectId || !apiKey || !baseUrl) {
    return res.status(500).json({ error: "Missing environment config" });
  }

  const apiUrl = req.body.apiUrl || `${baseUrl}/${projectId}/items`;
  // const PAGE_SIZE = 200;

  let continuationToken: string | undefined = undefined;
  let dataBuffer: RowData[] = [];

  try {
    while (true) {
      const headers: any = {
        Authorization: `Bearer ${apiKey}`,
      };      
      if (continuationToken) {
        headers["x-continuation"] = continuationToken;
      }

      const params = {
        ...queryParams,
        language
      };
      console.log("Final queryParams:", params);
 
      const response = await axios.get<ApiResponse>(apiUrl, { params, headers });

      const responseData: ApiResponse = response.data;
      
      if (!responseData.items || responseData.items.length <1) break;

      for (const item of responseData.items) {
        //console.log("Processing item: ", item, " Type: ", item.system?.type);
        const systemType = item.system?.type;
        if (!systemType || systemType !== queryParams["system.type"] || !item.elements) {
          //console.warn("Skipping item. systemType:", systemType, "Expected:", queryParams["system.type"], "elements present:", !!item.elements);
          continue;
        }
        if (systemType === "country_list") {
          dataBuffer.push({
            "Country Name": item.elements.country_title?.value || "",
            "Country Code": item.elements.country_code?.value || "",
            "Country Three Letter": item.elements.country_three_letter?.value || "",
            "Country Currency": item.elements.country_currency?.value || "",
          });
        }
        else {
          dataBuffer.push({
            Title: item.elements.title?.value || "",
          });
        }
      }

      continuationToken = responseData.continuationToken;
      if (!continuationToken) break;
    }
//console.log("Data Buffer Length: ", dataBuffer.length);
    if (dataBuffer.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // Create Excel file buffer
    const worksheet = XLSX.utils.json_to_sheet(dataBuffer);
    const workbook = XLSX.utils.book_new();
    const safeType = queryParams["system.type"]?.replace(/[\\/:*?"<>|]/g, "_") || "data";
    XLSX.utils.book_append_sheet(workbook, worksheet, safeType);
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Filename example: export_dev_country_list.xlsx
  
    const fileName = `TravelHotel_${environment}_${safeType}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(buffer);

  } catch (error: any) {
    console.error("API Error:", error.message || error);
    return res.status(500).json({ error: "Failed to fetch or process data" });
  }
}
