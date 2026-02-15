import fs from "fs";
import csv from "csv-parser";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import getKontentConfig from "./config";
import * as xlsx from "xlsx";

dotenv.config();

interface Config {
  projectId: string;
  apiKey: string;
  deliveryApiKey: string;
  baseUrl: string;
  contentTypeCodename: string;
  _DELIVERY_BASE_URL: string;
}

interface ValidationError {
  message: string;
}

interface ApiErrorResponse {
  validation_errors: ValidationError[];
}

const DEV_PROJECT_ID = process.env.KONTENT_DEV_PROJECT_ID || "";
const PROD_PROJECT_ID = process.env.KONTENT_PROD_PROJECT_ID || "";

const config: Config = getKontentConfig();

type LanguageMap = {
  [key: string]: {
    codename: string;
    id: string;
  };
};

const languageMap: LanguageMap = {
  "default": { codename: "default", id: "00000000-0000-0000-0000-000000000000" },
  "de-DE": { codename: "de-DE", id: "79228548-6576-5a60-acad-53360bf23687" },
  "ja-JP": { codename: "ja-JP", id: "4e8fa49a-27d3-44a7-8135-3dc21008ddd1" },
  "ko-KR": { codename: "ko-KR", id: "ce929a3d-f7df-4ab1-a1b5-aaa38a7a4812" },
  "zh-HK": { codename: "zh-HK", id: "e832b221-cbe7-442a-8edf-98a7ac7afac6" },
  "zh-TW": { codename: "zh-TW", id: "f0666814-0e42-48c7-a4c9-dea7c1d7b2ed" },
  "ar-AE": { codename: "ar-AE", id: "3dc9c67d-95d8-4594-890d-70f98c615fbd" },
  "es-MX": { codename: "es-MX", id: "0814121f-7011-4361-b7bd-cebd74fe4cd9" }
};

interface KontentItemResponse {
  id: string;
  codename: string;
  name: string;
  //system: Record<string, any>;
  //elements: Record<string, any>;
}

async function findLanguageVariant(
  contentItemCodename: string,
  languageId: string
): Promise<KontentItemResponse | null> {
  try {
    console.info(`${config.baseUrl}/${config.projectId}/items/codename/${contentItemCodename}/variants/codename/${languageId}`)
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/items/codename/${contentItemCodename}/variants/codename/${languageId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.debug(`Found language variant for language ${languageId} of content item ${contentItemCodename}. Response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    // If the error is a 404, it means the language variant does not exist, which is an expected scenario. We can return null in this case. For any other error, we should log it and rethrow.
    const err = error as AxiosError;
    if (err.response?.status === 404) {
      console.debug(`Language variant for language ${languageId} of content item ${contentItemCodename} not found. This is expected if the variant does not exist.`);
      return null;
    }
    else {
      console.error(`Error finding language variant for language ${languageId} of content item ${contentItemCodename}: ${error}`);
    }
    throw error; // real error
  }
}

async function newversionLanguageVariant(
  itemId: string,
  languageId: string
) {
  try {
    console.debug(`Creating new version of language variant for language ${languageId} of item ${itemId}`);
    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageId}/new-version`,
      {}, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Created new version of language variant for language ${languageId} of item ${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating new version of language variant for language ${languageId} of item ${itemId}: ${error}`);

    throw error;
  }
}

async function updateLanguageVariant(
  itemId: string,
  languageId: string,
  elements: {
    element: { codename: string };
    value: string;
  }[]
) {
  try {
    const languageInfo = getLanguageInfo(languageId);
    console.debug(`Updating language variant. ${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageInfo?.id}`);

    const requestBody = {
      "elements": 
         elements
    };
    console.info(`Updating language variant for language ${languageId} of item ${itemId} with elements: ${JSON.stringify(requestBody)}`);
    
    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageInfo?.id}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Updated language variant for language ${languageId} of item ${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating language variant for language ${languageId} of item ${itemId}: ${error}`);
    throw error;
  }
}

async function findContentItem(contentItemCodename: string): Promise<KontentItemResponse | null> {
  try {

    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/items/codename/${contentItemCodename}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Found content item with codename ${contentItemCodename} and id: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`Error finding content item with codename ${contentItemCodename}: ${error}`);
    throw error; // real error
  }
}

async function createContentItem(itemName: string, itemCodename: string) {
  try {
    const response = await axios.post(
      `${config.baseUrl}/${config.projectId}/items`,
      {
        name: itemName,
        codename: itemCodename,
        type: { codename: config.contentTypeCodename },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Created content item ${itemCodename} with id: ${response.data.id}`);
    return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {  
        console.error(`Error creating content item ${itemCodename}: ${error.message} Status: ${error.response?.status} Response: ${JSON.stringify(error.response?.data, null, 2)}`); 
      } else {
        console.error(`Error creating content item ${itemCodename}: ${error}`); 
      }
    throw error;
  }
}

async function addLanguageVariant(
  itemId: string,
  languageId: string,
  elements: {
    element: { codename: string };
    value: string;
  }[]
) {
  try {
    const languageInfo = getLanguageInfo(languageId);
    console.debug(`Adding language variant for language ${languageInfo?.id} to item ${itemId} with elements: ${JSON.stringify(elements)}`);
    
    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageInfo?.id}`,
      {
        elements,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Added language variant for language ${languageId} to item ${itemId}`);
    return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {  
        console.error(`Error adding language variant for language ${languageId} to item ${itemId}: ${error.message} Status: ${error.response?.status} Response: ${JSON.stringify(error.response?.data, null, 2)}`);  
      } else {
        console.error(`Error adding language variant for language ${languageId} to item ${itemId}: ${error}`); 
      } 
    throw error;
  }
}

async function fetchReviewStepId() {
  try {
    // https://manage.kontent.ai/v2/projects/0fbc3572-8f63-0030-94d3-231315ab5e58/workflows
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/workflows`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );

    const { data } = response;

    const defaultWorkflow = data.filter(
      (d: { codename: string }) => d.codename === "default"
    );

    const reviewStep = defaultWorkflow[0].steps.filter(
      (d: { codename: string }) => d.codename === "review"
    );

    return reviewStep[0]?.id;
  } catch (error) {
    console.error(`Error fetching review step id: ${error}`);
    throw error;
  }
}

async function transitionLanguageToReview(
  itemId: string,
  languageId: string,
  reviewStepId: string
) {
  // https://manage.kontent.ai/v2/projects/0fbc3572-8f63-0030-94d3-231315ab5e58/items/23de5f44-473b-5817-8128-4e12c2e495ad/variants/codename/default/change-workflow
  try {
    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageId}/change-workflow`,
      {
        workflow_identifier: {
          codename: "default",
        },
        step_identifier: {
          id: reviewStepId,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Transitioned language variant for language ${languageId} of item ${itemId} to review step`);
    return response.data;
  } catch (error) {
    console.error(`Error transitioning language variant for language ${languageId} of item ${itemId} to review step: ${error}`);
    throw error;
  }
}

async function publishLanguageVariant(itemId: string, languageId: string) {
  try {
    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageId}/publish`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.info(`Published language variant for language ${languageId} of item ${itemId}`);
    return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {  
        console.error(`Error publishing language variant for language ${languageId} of item ${itemId}: ${error.message} Status: ${error.response?.status} Response: ${JSON.stringify(error.response?.data, null, 2)}`);  
      }
      else {  
        console.error(`Error publishing language variant for language ${languageId} of item ${itemId}: ${error}`);  
      }
    throw error;
  }
}

type CsvRow = Record<string, string>;

function mapCsvRowToElements(row: CsvRow, languageColumn: string) {
  return [
    {
      element: { codename: "title" },
      value: row[languageColumn] || row["default"] || "",
    },
  ];
}

// function getLanguageId(languageCode: string): string | undefined {
//   return languageMap[languageCode];
// }

function getLanguageInfo(languageCode: string): { codename: string; id: string } | undefined {

  return languageMap[languageCode];
}

function toCodename(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\/]/g, "_")        // replace /
    .replace(/\+/g, "_")        // replace +
    .replace(/[-\s&]+/g, "_")     // replace space, -, &
    .replace(/[^a-z0-9_]/g, "");   // remove anything else unsafe
    //.replace(/_+/g, "_")          // collapse multiple _
    //.replace(/^_+|_+$/g, "");     // trim leading/trailing _
}

function hasAnyElementValue(elements: Record<string, any>): boolean {
  return Object.values(elements).some((element) => {
    const value = element?.value;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return false;
  });
}

export async function processCsvFile(
  filePath: string,
  userEnvVariable: string,
  type: string
) {
  
  console.info(`Processing CSV file: ${filePath}`);

  const results: CsvRow[] = [];
  const languages = Object.keys(languageMap);

  config.projectId =
    userEnvVariable === "prod" ? PROD_PROJECT_ID : DEV_PROJECT_ID;

  config.contentTypeCodename = type;

  let processedCount = 0;
  let unprocessedCount = 0;
  const unprocessedRecords: { name: string; reason: string }[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ headers: languages }))
      .on("data", (row: CsvRow) => results.push(row))
      .on("end", async () => {
        try {
          for (let i = 1; i < results.length; i++) {
            const row = results[i];
            console.debug(`Available languages in row: ${Object.keys(row).join(", ")}`);
            
            //Check for each language and value
            for (const [languageCode, value] of Object.entries(row)) {
              if (!value?.trim()) continue;
              const key = languageCode.trim();

              if (key === "codename") continue; // skip codename column for language variant processing

              console.debug(`Checking language ${key} with value: ${value.trim()}`);
              
              //const value = row[keyToFind as keyof typeof row];

              if (value && value.trim() !== "") {
                console.debug(`Processing content item for language ${key} with value: ${value.trim()}`);

                const itemName = value.trim();
                const itemCodename = `${type}_${toCodename(itemName)}`;
                  
                  let contentItem = await findContentItem(itemCodename);

                  //If content item does not exists, add the content item
                  if (contentItem == null && contentItem == undefined) {
                    console.debug(`Content item with codename ${itemCodename} does not exist. Response: ${JSON.stringify(contentItem)}`);

                    const contentItemNew = await createContentItem(
                      itemName,
                      itemCodename
                    );

                    let reviewStepId = null;
                    if (userEnvVariable === "prod") {
                      reviewStepId = await fetchReviewStepId();
                      console.debug(`Review step id: ${reviewStepId}`);
                    }
                    for (const language of languages) {
                      const languageInfo = getLanguageInfo(language);

                      //const languageId = getLanguageId(language);
                      if (!languageInfo?.id) continue;
                      if (languageInfo.codename === "codename") continue; // skip default language for variant creation

                      const elements = mapCsvRowToElements(row, languageInfo.codename);
                      await addLanguageVariant(contentItemNew.id, languageInfo.id, elements);
                      if (userEnvVariable === "prod") {
                        await transitionLanguageToReview(
                          contentItemNew.id,
                          languageInfo.id,
                          reviewStepId
                        );
                      }
                      await publishLanguageVariant(contentItemNew.id, languageInfo.id);

                      processedCount++;
                    } //end for languages
                  } //end if content item exists
                  else {
                    //contentItem = await findContentItem(itemCodename);
                    
                    console.debug(`Content item with codename ${itemCodename} already exists with id: ${contentItem.id}. Response: ${JSON.stringify(contentItem)}`);
                    const elements = mapCsvRowToElements(row, key);

                    let contentItemVariant = await findLanguageVariant(
                      contentItem?.codename,
                      key
                    );

                    if (contentItemVariant==null || contentItemVariant==undefined) {
                      if (hasAnyElementValue(elements)) {
                        await addLanguageVariant(contentItem?.id, key, elements);  
                      }
                    }
                    else {
                      if (hasAnyElementValue(elements)) {
                        await newversionLanguageVariant(
                          contentItem?.id,
                          key
                        );
                        await updateLanguageVariant(contentItem?.id, key, elements);
                      }
                    }

                    let reviewStepId = null;
                    if (userEnvVariable === "prod") {
                    reviewStepId = await fetchReviewStepId();
                    console.debug(`Review step id: ${reviewStepId}`);
                    }

                    if (userEnvVariable === "prod") {
                      await transitionLanguageToReview(
                        contentItem?.id,
                        key,
                        reviewStepId
                      );
                    }
                    await publishLanguageVariant(contentItem?.id, key);

                    processedCount++;
                    continue;
                  }


                

                
                console.info(`CSV processing completed. Processed: ${processedCount}, Unprocessed: ${unprocessedCount} Unprocessed Records: ${JSON.stringify( unprocessedRecords )}` );  

                resolve({
                  processedCount,
                  unprocessedCount,
                  unprocessedRecords,
                });


              } else {
                console.debug(`No value found for language ${key}`);
              }
            } //end forEach Object.entries
            
                 

            

          } //end for results
        } catch (error) {
          
          console.error(`Error processing CSV: ${error}`);
          reject(error);
        } //end try
      }) //async end 
      .on("error", (error) => {
        console.error(`Error reading CSV file: ${error}`); 
        reject(error);
      });
  });
}