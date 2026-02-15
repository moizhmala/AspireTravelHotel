import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getKontentConfig from "@/utils/config";
//import { createDeliveryClient } from '@kontent-ai/delivery-sdk';


async function getLanguages(headers: any) {

  const config = getKontentConfig();
  const url = `${config._DELIVERY_BASE_URL}/${config.projectId}/languages`;

  let response: any;
  try {

    response = await axios.get(url, { headers });
    return response;

  } catch (error: any) {
    console.error("Error fetching languages:", error?.message || error);
   return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = getKontentConfig();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    let consolidatedData: any[] = [];
    let fetchData = true;

    let headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
      Authorization: `Bearer ${config.deliveryApiKey}`,
    };

    while (fetchData) {
      
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
      return res.status(404).json({ message: "No languages found." });
    }
    // Filter and sort the languages
    
    const filteredLanguages = consolidatedData
  .filter((lang: any) => lang?.system?.name && lang?.system?.codename)
  .sort((a, b) => a.system.name.localeCompare(b.system.name))
  .map((lang) => ({
    name: lang.system.name,
    codename: lang.system.codename,
  }));

    return res.status(200).json({ languages: filteredLanguages });

  } catch (error: any) {
    console.error("Error fetching languages:", error?.message || error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
