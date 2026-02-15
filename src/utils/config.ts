import dotenv from "dotenv";

dotenv.config();

interface Config {
  projectId: string;
  apiKey: string;
  deliveryApiKey: string;
  baseUrl: string;
  _DELIVERY_BASE_URL: string;
  contentTypeCodename: string;
}

const config: Config = {
  projectId:
    (process.env.ENV === "prod"
      ? process.env.KONTENT_PROD_PROJECT_ID
      : process.env.KONTENT_DEV_PROJECT_ID) || "",
  apiKey:
    (process.env.ENV === "prod"
      ? process.env.KONTENT_PROD_MANAGEMENT_API_KEY 
      : process.env.KONTENT_DEV_MANAGEMENT_API_KEY) || "",
  deliveryApiKey:
    (process.env.ENV === "prod"
      ? process.env.KONTENT_PROD_DELIVERY_API_KEY
      : process.env.KONTENT_DEV_DELIVERY_API_KEY) || "",
  baseUrl:
    (process.env.ENV === "prod"
      ? process.env.KONTENT_PROD_BASE_URL
      : process.env.KONTENT_DEV_BASE_URL) || "",
  _DELIVERY_BASE_URL:
    (process.env.ENV === "prod"
      ? process.env.KONTENT_PROD_DELIVERY_BASE_URL
      : process.env.KONTENT_DEV_DELIVERY_BASE_URL) || "https://deliver.kontent.ai",
  contentTypeCodename: process.env.CONTENT_TYPE_CODENAME || "",
};

export default function getKontentConfig() {
  require("fs").appendFileSync("debug.txt", `Using config: ${JSON.stringify(config)}` + "\n");
  return config;
}
