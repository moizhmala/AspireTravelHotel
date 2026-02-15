import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

interface ApiItem {
  system: { type: string };
  elements?: {
    name?: { value: string };
    cuisine?: { value?: string[] };
    price_rating?: { value?: string[] };
    atmosphere?: { value?: string[] };
    dress_code?: { value?: string[] };
  };
  
}

interface ApiResponse {
  items: ApiItem[];
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
  //let dataBuffer: ApiResponse[] = [];
  let dataBuffer: Record<string, string>[] = [];

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
        language,
        "depth": 2, // Adjust depth as needed
      };
      console.log("Final queryParams:", params);
      //console.log("A " + projectId +" B " + apiKey + " C " + baseUrl);

      // ✅ Step 1: Read name list from local CSV
      const csvPath = path.resolve("./data/DiningItemList.csv");
      let nameList: string[] = [];
      try {
        const content = fs.readFileSync(csvPath, "utf-8");
        const records = parse(content, {
          columns: false,
          skip_empty_lines: true,
          trim: true,
        });
        nameList = records.flat();
      } catch (err) {
        return res.status(500).json({ error: "Failed to read or parse local CSV" });
      }

      if (!nameList.length) {
        return res.status(400).json({ error: "No names found in CSV" });
      }
console.log("Name List Length: ", nameList.length);
      // ✅ Step 2: Add name list to queryParams
      //params["elements.name.value[in]"] = nameList.join(",");
      const response = await axios.get<ApiResponse>(apiUrl, { params, headers });

      const responseData: ApiResponse = response.data;
      
      if (!responseData.items || responseData.items.length === 0) break;

      for (const item of responseData.items) {
        //console.log("Processing item: ", item, " Type: ", item.system?.type);
        const itemSystemType = item.system?.type;
        if (!itemSystemType || itemSystemType !== queryParams["system.type"] || !item.elements) {
          //console.warn("Skipping item. systemType:", systemType, "Expected:", queryParams["system.type"], "elements present:", !!item.elements);
          continue;
        }
        if (itemSystemType === "template_dining") {
          dataBuffer.push({
            "Name": item.elements.name?.value || "",
            "Cuisine": item.elements.cuisine?.value?.join(", ") || "",
            "Price Rating": item.elements.price_rating?.value?.join(", ") || "",
            "Atmosphere": item.elements.atmosphere?.value?.join(", ") || "",
            "Dress Code": item.elements.dress_code?.value?.join(", ") || "",
          });
        }
        else  {
          dataBuffer.push({
            "Name": item.elements.name?.value || "",
            // Add other fields as needed
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Filename example: export_dev_country_list.xlsx
    const safeType = queryParams["system.type"]?.replace(/[\\/:*?"<>|]/g, "_") || "data";
    const fileName = `Monarch_${environment}_${safeType}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(buffer);

  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error.message || error);
    return res.status(500).json({ error: "Failed to fetch or process data" });
  }
}
