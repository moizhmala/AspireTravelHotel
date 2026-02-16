import fs from "fs";
import csv from "csv-parser";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import getKontentConfig from "./config";
import * as xlsx from "xlsx";
import { console } from "inspector";
import { create } from "domain";


dotenv.config();

interface Config {
  projectId: string;
  apiKey: string;
  baseUrl: string;
  contentTypeCodename: string;
  _DELIVERY_BASE_URL: string;
  deliveryApiKey: string;
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


// const elementIdMap: Record<string, string> = {
//   "Web Header HTML": "96941a4c-bc8f-4eb1-8f65-9e023e1b6d22",
//   "Web Header Style": "e7036234-8439-4230-b4f4-ef0ab56fd364",
//   "Web Header Script": "89d8f6a7-3d8d-4fc1-803a-bf20a1f71887",
//   "Web Footer HTML": "b38392bd-ee06-4aa2-a377-0888f9fa5183",
//   "Web Footer Style": "f64c4c3c-807c-47b0-87d0-b6c03dd1044f",
//   "Web Footer Script": "5ab4f5fa-4a82-443a-aec9-5b1f30048f6c",
//   "Email Header HTML": "header_html",
//   "Email Header Style": "header_css",
//   "Email Header Script": "header_script",
//   "Email Footer HTML": "footer_html",
//   "Email Footer Style": "footer_css",
//   "Email Footer Script": "footer_script",
// };

async function fetchElementIdMap(contentTypeCodename: string): Promise<Record<string, string>> {
  try {
    console.debug( `Fetching element ID map for type: ${config.baseUrl}/${config.projectId}/types/codename/${contentTypeCodename}` + "\n");
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/types/codename/${contentTypeCodename}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );

    const elementMap: Record<string, string> = {};

    for (const element of response.data.elements) {
      elementMap[element.name.trim()] = element.id;
    }

    return elementMap;
  } catch (error) {
    console.error(`❌ Error fetching element ID map for type "${contentTypeCodename}":`, error);
    throw error;
  }
}

export const validateCsv = (filePath: string): Promise<void> => {
  const REQUIRED_HEADERS = Object.keys(languageMap);
  return new Promise((resolve, reject) => {
    const headersSet = new Set<string>();
    let hasDataRow = false;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        headers.forEach((header: string) => headersSet.add(header.trim())); // Normalize headers
      })
      .on("data", () => {
        hasDataRow = true; // At least one data row exists
      })
      .on("end", () => {
        const missingHeaders = REQUIRED_HEADERS.filter(
          (header) => !headersSet.has(header)
        );

        if (missingHeaders.length > 0) {
          return reject(
            new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
          );
        }

        if (!hasDataRow) {
          return reject(
            new Error("CSV must contain at least one row of data.")
          );
        }

        resolve();
      })
      .on("error", (err) => {
        reject(new Error("Error reading CSV file: " + err.message));
      });
  });
};

async function findContentItem(contentItemCodename: string) {
  try {
    // console.log(
    //   `Finding content item with codename: ${config.baseUrl}/${config.projectId}/items/codename/${contentItemCodename}`
    // );
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/items/codename/${contentItemCodename}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error finding content item: ${error}`);
    return false;
  }
}

async function findContentItemVariant(contentItemID: string, languageCodename: string) {
  try {
    console.debug( `Finding content item variant: ${config.baseUrl}/${config.projectId}/items/${contentItemID}/variants/${languageCodename}` + "\n");
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/items/${contentItemID}/variants/codename/${languageCodename}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error finding content item variant: ${error}`);
    return false;
  }
}

async function deleteExistingDraftVersion (contentItemID: string, languageCodename: string, contentItemVariant: any) { 
  try {

    //get content item variant
    const contentItemVariant =await findContentItemVariant(contentItemID, languageCodename);

    //check content item variant workflow step
    console.debug( `Current workflow step for ${languageCodename}: ${contentItemVariant.workflow_step?.id || 'N/A'}` + "\n");

    if (contentItemVariant.workflow_step?.id === "eee6db3b-545a-4785-8e86-e3772c8756f9") { //draft step id
      console.debug( `Deleting existing draft version for: ${config.baseUrl}/${config.projectId}/items/${contentItemID}/variants/codename/${languageCodename}` + "\n"); 
      const response = await axios.delete( 
        `${config.baseUrl}/${config.projectId}/items/${contentItemID}/variants/codename/${languageCodename}`,
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
        } 
      );  
      console.debug( `✅ Deleted existing draft version for language: ${languageCodename}` + "\n");
      return response.data; 
    } 
  } catch (error) {
    console.error(`Error deleting existing draft version: ${error}`);
    throw error;
  }
}

async function createContentItem(itemName: string, itemCodename: string, contentTypeCodename: string) {
  try {
    const response = await axios.post(
      `${config.baseUrl}/${config.projectId}/items`,
      {
        name: itemName,
        codename: itemCodename,
        type: { codename: contentTypeCodename },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.debug( `✅ Created content item: ${itemCodename}` + "\n");
    return response.data;
  } catch (error) {
    console.debug( `Error creating content item: ${error}` + "\n");
    throw error;
  }
}

async function createLanguagVariant(
  itemId: string,
  languageId: string
) {
  try {

   //let contentItem = await findContentItemVariant(itemId, languageId);
    //if (contentItem) {
       //console.debug( `Creating language variant ${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageId}/new-version` + "\n");
      const response = await axios.put(
        `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageId}/new-version`,
        {}, // empty body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
        }
      );
      fs.appendFileSync("debug.txt", `✅ Variant new version created for language ${languageId}` + "\n");
    return response.data;
    //}
   
    
    
  } catch (error) {
    //console.error(`Error creating language variant: ${error}`);
    console.debug( `Error creating language variant: ${error}` + "\n");
    throw error;
  }
}

async function addLanguageVariant( itemId: string, languageId: string, templateName: string, nameValue: string, clientidValue: string, programidValue: string,
  elements: {
    element: { codename: string };
    value: string;
  }[]
  
) {
  try {
    console.debug( `Adding language variant ${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageId}` + "\n");  

    const customHeaders = {
      'Content-Type': 'application/json',
      "Accept": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    };

    const AppendElements = [
      {
        element: {
          codename: "content_type"
        },
        value: [
          { codename: templateName }
        ]
      },
      {
        element: {
          codename: "name"
        },
        value: nameValue
      },
      {
        element: {
          codename: "client_availability"
        },
        value: [
          { codename: "client_availability_list_restricted" }
        ]
      },
      {
        element: {
          codename: "client_id"
        },
        value: [
          { codename: clientidValue }
        ]
      },
      {
        element: {
          codename: "program_id"
        },
        value: [
          { codename: programidValue }
        ]
      }
    ];

    const requestBody = {
      elements: [...elements, ...AppendElements],
      
    };

    console.debug( `requestBody to add: ${JSON.stringify(requestBody, null, 2)}` + "\n");

    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/${languageId}`,
       requestBody ,
      { headers: customHeaders }
      
    );

    console.debug( `✅ Variant update success for language ${languageId}` + "\n");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
                // Handle axios errors
                console.debug( `Error Adding language variant | Axios error: ${error}` + "\n");
            } else {
                // Handle non-axios errors
                console.debug( `Error Adding language variant | Non-axios error: ${error}` + "\n");
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
    console.error(`Error publishing language variant: ${error}`);
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
    return response.data;
  } catch (error) {
    console.error(`Error publishing language variant: ${error}`);
    throw error;
  }
}

async function publishLanguageVariant(itemId: string, languageId: string) {
  try {
    const scheduledTo = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const payload = {
      scheduled_to: scheduledTo,
      display_timezone: "Asia/Kolkata"
    };

    const OmitPayload = {
      
    };

    const response = await axios.put(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageId}/publish`,
      OmitPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );
    console.debug( `✅ Published language variant ${languageId}` + "\n");
    return response.data;
  } catch (error) {
    console.warn( `Error publishing language variant: ${error}` + "\n");
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

function getLanguageInfo(languageCode: string): { codename: string; id: string } | undefined {

  return languageMap[languageCode];
}

async function doesLanguageVariantExist(itemId: string, languageCodename: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${config.baseUrl}/${config.projectId}/items/${itemId}/variants/codename/${languageCodename}`,
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.status === 200;
    
  } catch (error: any) {
    if (error.response?.status === 404) return false;
    throw error;
  }
}

function compressAndEscapeHtml(html: string): string {
  const compressedHtml = html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove all HTML comments
    .replace(/\s{2,}/g, ' ')         // Collapse multiple spaces
    .replace(/\n/g, '')              // Remove newlines
    .replace(/\r/g, '')              // Remove carriage returns
    .replace(/>\s+</g, '><')         // Remove whitespace between tags
    //.replace(/"/g, "'")             // Replace double quotes with single quotes
    .replace(/\\"/g, '"')  // Replace \" with "
    .replace(/\"/, '"') // Replace \" with "
    .trim();                         // Remove leading/trailing spaces

  //const escapedHtml = compressedHtml.replace(/"/g, '\\"'); // Escape double quotes

  return compressedHtml;
}

export async function processXlsxFile(
  filePath: string,
  userEnvVariable: string,
  type: string
) {
  console.log(`Processing XLSX file: ${filePath}`);

  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const languageVariablePairs: {
    language: string;
    variable: string;
    columnIndex: number;
  }[] = [];

  let currentLanguage = "";
  for (let col = 3; col < rows[1].length; col++) {
    const langCell = rows[0][col];
    const variableCell = rows[1][col];

    if (langCell?.trim()) currentLanguage = langCell.trim();
    console.debug(`Processing column ${col}: Language: ${currentLanguage}, Variable: ${variableCell}`);
    const variable = variableCell?.trim();
    if (currentLanguage && variable) {
      languageVariablePairs.push({
        language: currentLanguage,
        variable,
        columnIndex: col,
      });
    }
  }

  //console.log("✅ Extracted header pairs:", languageVariablePairs);

  const contentTypeCodename = "travel_header_footer_model";
  config.projectId =
    userEnvVariable === "prod" ? PROD_PROJECT_ID : DEV_PROJECT_ID;
  config.apiKey = userEnvVariable === "prod"
    ? (process.env.KONTENT_PROD_MANAGEMENT_API_KEY?.toString() ?? "")
    : (process.env.KONTENT_DEV_MANAGEMENT_API_KEY?.toString() ?? "");
  config.contentTypeCodename = type;

  //const rawElementIdMap = await fetchElementIdMap(contentTypeCodename);
  let rawElementIdMap: any;
  try {
    rawElementIdMap = await fetchElementIdMap(contentTypeCodename);
    //console.log("🗺️ Element ID Map Fetched:", rawElementIdMap);
  } catch (error) {
    console.error("❌ Failed to fetch element ID map:", error);
    throw error; // Important: rethrow to propagate
  }

  const elementIdMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawElementIdMap)) {
    if (typeof value === "string") {
      const normalizedKey = key.replace(/\s+/g, " ").trim();
      console.debug(`🔑 Normalizing key: "${key}" to "${normalizedKey}" with value: ${value}`);
      elementIdMap[normalizedKey] = value;
    } else {
      console.warn(`⚠️ Unexpected non-string value for key: ${key}`, value);
    }
  }

  //console.log("🗺️ Normalized elementIdMap keys:", Object.keys(elementIdMap));

  let processedCount = 0;
  let unprocessedCount = 0;
  const unprocessedRecords: { name: string; reason: string }[] = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row[2]) continue;

    const originalName = String(row[2]).trim();
    const codenameBase = originalName.replace(/\s+/g, "_").toLowerCase();
    const templateSuffix = type === "email_template" ? "email" : "web";
    const itemName =
      originalName + " " + templateSuffix.charAt(0).toUpperCase() + templateSuffix.slice(1);
    const itemCodename = `${codenameBase}_${templateSuffix}`;

    try {
      let contentItem = await findContentItem(itemCodename);
      console.log(`🔍 Searching for content item: ${itemCodename}`);
      
      if (!contentItem) {
        console.log(`🔧 Content item does not exist. Creating: ${itemCodename}`);
        contentItem = await createContentItem(itemName, itemCodename, contentTypeCodename);
      } else {
        console.log(`🔄 Content item exists. Updating: ${itemCodename}`);
      }

      const reviewStepId =
        userEnvVariable === "prod" ? await fetchReviewStepId() : null;

      const languageElementMap: Record<string, any[]> = {};
      const languageIdToCodenameMap: Record<string, string> = {};
      const languageNameElementMap: Record<string, string> = {};
      const languageClientIDElementMap: Record<string, string> = {};
      const languageProgramIDElementMap: Record<string, string> = {};
      
      for (const { language, variable, columnIndex } of languageVariablePairs) {
        const value = row[columnIndex]; //HTML, CSS, Script values
        console.debug(`📄 Check point 1 Processing item: ${itemName} (${itemCodename}) | ${language.trim()} | Columnn: ${columnIndex} | Variable: ${variable} `)
        const languageInfo = languageMap[language.trim()];
        console.debug(`🔎 Processing language: "${language}" with variable: "${variable}" and value: "${value}"`);
        if (!languageInfo) {
          console.warn(`⚠️ Language not found: "${language}"`);
          continue;
        }

        const languageId = languageInfo.id;
        const languageCodename = languageInfo.codename;
        languageIdToCodenameMap[languageId] = languageCodename;
        languageNameElementMap[languageId] = row[2] + " Web"; // Name value from the third column
        languageClientIDElementMap[languageId] = "client_id_list_" + row[1].toString().toLowerCase();; // Client ID value
        languageProgramIDElementMap[languageId] = "program_id_list_" + row[2].toString().replace(/\s+/g, "_").toLowerCase();; // Program ID value

        const withoutPrefix = variable
          .replace(/^(Web|Email)\s+/i, "") // remove prefix
          .replace(/\b(HTML|Style|Script)\b/, (match: string): string => {
            switch (match) {
              case "HTML":
                return "HTML";
              case "Style":
                return "CSS"; // your `elementIdMap` uses 'CSS' not 'Style'
              case "Script":
                return "Script";
              default:
                return match; // fallback: safe default to match itself
            }
          })

        const normalizedVariable = withoutPrefix.replace(/\s+/g, " ").trim();
        //console.log(`🔎 Final mapped variable: "${normalizedVariable}"`);
        const elementId = elementIdMap[normalizedVariable];

        if (!elementId) {
          console.warn(`⚠️ Element ID not found for variable: "${normalizedVariable}"`);
          continue;
        }
        if (!languageId) {
          console.warn(`⚠️ Language code not found for: "${language}"`);
          continue;
        }

        const isCustom = true; // for now assuming all are custom — adjust if needed

        //if (!languageElementMap[languageId]) languageElementMap[languageId] = [];

        //const htmlValue = String(value || "").trim();
        let safeHtml = String(value || "").trim();
        try {
          console.debug(`🔎 Processing value for variable "${normalizedVariable}": `)

          if (normalizedVariable === "Header HTML" || normalizedVariable === "Footer HTML" || normalizedVariable === "Header CSS" || normalizedVariable === "Footer CSS") {
          safeHtml =  compressAndEscapeHtml(String(value || "")); // Compress and escape HTML value
        }
        } catch (e) {
          console.error("❌ Failed to write to debug.txt:", e);
        }
        

if (!languageElementMap[languageInfo.id]) {
  languageElementMap[languageInfo.id] = [];
}

  if (typeof safeHtml === "string" && safeHtml.trim().length > 0) {
    languageElementMap[languageId].push({
      element: { id: elementId },
      value: safeHtml,
    });
  }

    
        if (userEnvVariable === "prod") {
            //await transitionLanguageToReview(contentItem.id, langEntry.codename, reviewStepId);
          }
        //await publishLanguageVariant(contentItem.id, langEntry.codename);

        
        
      } //languageVariablePairs for loop ends



      processedCount++;      // Now, iterate over each language and update/create variants

      for (const [langId, elements] of Object.entries(languageElementMap)) {

        if (elements.length === 0) {
          console.debug( `⚠️ No elements to process for language ID: ${langId}. Skipping.` + "\n");
          continue; // Skip if no elements to process
        }

        const languageCodename = languageIdToCodenameMap[langId];
        console.debug( `📤 Updating/Creating variant for language: ${languageCodename} with elements: ` + "\n"); //${JSON.stringify(elements, null, 2)}
      

        const variantExists = await doesLanguageVariantExist(contentItem.id, languageCodename);
        console.debug( `Variant details for language ${languageCodename}: ${JSON.stringify(variantExists, null, 2)}` + "\n");
        
        if (!variantExists) {
          console.debug( `🔧 Variant does not exist for language: ${languageCodename}. Creating new variant.` + "\n");
          //await createContentItem(itemName, itemCodename, contentTypeCodename);
          //await createLanguagVariant(contentItem.id, languageCodename);
        } else {
          console.debug( `🔄 Variant exists for language: ${languageCodename}. Updating existing variant.` + "\n");
          //delete existing draft version if any
          await deleteExistingDraftVersion (contentItem.id, languageCodename, variantExists);

          //After deleting create new content item version
          //await createContentItem(itemName, itemCodename, contentTypeCodename);
          
          await createLanguagVariant(contentItem.id, languageCodename); // create new version before update
        }

        await addLanguageVariant(
          contentItem.id,
          langId, // Use language ID instead of codename
          templateSuffix,
          languageNameElementMap[langId],
          languageClientIDElementMap[langId],
          languageProgramIDElementMap[langId],
          elements
        );
        
        if (userEnvVariable === "prod" && reviewStepId) {
          await transitionLanguageToReview(contentItem.id, languageCodename, reviewStepId);
        } 
        await publishLanguageVariant(contentItem.id, languageCodename);
      }

      console.debug( `✅ Successfully processed item: ${originalName}` + "\n");
      
    } catch (error) {
      const err = error as AxiosError;
      const response = err?.response?.data as ApiErrorResponse;
      const reason = response?.validation_errors?.[0]?.message || err.message;
      //console.error(`❌ Error processing item: ${originalName}: ${reason}`);
      console.debug( `❌ Error processing item: ${originalName}: ${reason}` + "\n");
      unprocessedRecords.push({ name: originalName, reason });
      unprocessedCount++; 
    }
  }

  return {
    processedCount,
    unprocessedCount,
    unprocessedRecords,
  };
}
