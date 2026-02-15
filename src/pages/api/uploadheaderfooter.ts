// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import dotenv from "dotenv";
import { processXlsxFile } from "@/utils/headerfootergenerator";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,   // <- Tells Next.js this is handled manually
  },
  runtime: "nodejs", // <- Force Node.js runtime (not edge)
};

type FileResponseType = {
  processedCount: number;
  unprocessedCount: number;
  unprocessedRecords: { name: string; reason: string }[];
};

const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log("📥 Inside form.parse()");
      if (err) {
        console.error("❌ Error during form parsing:", err);
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request method:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { files, fields } = await parseForm(req);

    if (!files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile.filepath) {
      return res.status(400).json({ message: "Invalid file upload" });
    }
    const userEnvVariable = fields.environment as string[];
    const type = fields.type as string[];
    const file = uploadedFile.filepath; // Ensure `filepath` is correct for your version
    const response: FileResponseType = (await processXlsxFile(
      file,
      userEnvVariable[0],
      type[0]
    )) as FileResponseType;
    return res.status(200).json({
      message: `File processed successfully`,
      processedCount: response.processedCount,
      unprocessedCount: response.unprocessedCount,
      unprocessedRecords: response.unprocessedRecords,
    });
  } catch (error) {
    console.error("❌ Error processing upload:", error);
    const errorMsg = error instanceof Error ? error.message : "Error processing file";
    return res.status(500).json({ message: errorMsg });
  }
};

export default uploadHandler;
