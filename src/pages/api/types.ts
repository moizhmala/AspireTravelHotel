import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getKontentConfig from "@/utils/config";
//import { createDeliveryClient } from '@kontent-ai/delivery-sdk';


async function getTypes(headers: any) {
  const config = getKontentConfig();

  const response = await axios.get(
    `${config._DELIVERY_BASE_URL}/${config.projectId}/types`,
    {
      headers,
    }
  );

  return response
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config = getKontentConfig();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {

    // const deliveryClient = createDeliveryClient({
    //   environmentId: `${config.projectId}`// 'KONTENT_AI_ENVIRONMENT_ID'
    // });

    // const response1 = await deliveryClient.types()
    // .limitParameter(3)
    // .toPromise();


    let consolidatedData: any = []
    let fetchData = true
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.deliveryApiKey}`,
    }


    while (fetchData) {
      const tempData = await getTypes(headers)
      consolidatedData = [...consolidatedData, ...tempData?.data?.types];
      if (tempData?.data?.pagination && tempData?.data?.pagination?.continuation_token) {
        headers = {
          ...headers,
          "x-continuation": (tempData?.data?.pagination?.continuation_token as string)
        } as any
      } else {
        fetchData = false
      }

    }

    // Fetch data from Kontent.ai API
    const response = await axios.get(
      `${config._DELIVERY_BASE_URL}/${config.projectId}/types`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.deliveryApiKey}`,
        },
      }
    );

    const data = consolidatedData;

    // Filter types that contain "list" in their name
    if (!data || !Array.isArray(data)) {
      return res.status(404).json({ message: "No types found." });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "No types found." });
    }
    // Filter and sort types that contain "list" in their name

     const filteredData = data
     //.filter((system) => system.codename?.toLowerCase().includes("list"))
     .filter((type) => type.system?.codename?.toLowerCase().includes("list"))
     .sort((a, b) => a.system.name.localeCompare(b.system.name))
     .map((type) => ({
       name: type.system.name,
       codename: type.system.codename,
       elements: type.elements,
     }));
    // console.log("Filtered Data: ", filteredData);
    
   
    return res.status(200).json({ types: filteredData });
  } catch (error) {
    console.error("Error fetching types:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
