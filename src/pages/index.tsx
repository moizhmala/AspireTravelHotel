import { JSX, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Languages, Upload } from "lucide-react";
import { useRouter } from "next/router";
import {ExportButton} from "../components/ExportButton";
// Define our TypeScript interfaces
interface FileType {
  name: string;
  codename: string;
}

interface Language {
  name: string;
  codename: string;
}

interface UnprocessedRecord {
  name: string;
  reason: string;
}

interface UploadResponse {
  message: string;
  processedCount: number;
  unprocessedCount: number;
  unprocessedRecords: UnprocessedRecord[];
}

interface ApiTypesResponse {
  types: FileType[];
}

interface ApiLanguagesResponse {
  languages: Language[];
}

export default function Home(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState<string>("dev");
  const [types, setTypes] = useState<FileType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("default");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [fetchingTypes, setFetchingTypes] = useState<boolean>(true);
  const [fetchingLanguages, setFetchingLanguages] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const path = router.asPath;

    if (path === "/prod") {
      setEnvironment("prod");
    } else {
      setEnvironment("dev");
    }
  }, [router.asPath]);

  // Fetch types from internal API
  useEffect(() => {
    const fetchTypes = async (): Promise<void> => {
      setFetchingTypes(true);
      try {
        const response = await fetch("/api/types");
        if (!response.ok) {
          throw new Error("Failed to fetch types");
        }
        const data: ApiTypesResponse = await response.json();
        setTypes(data.types || []);
      } catch (error: unknown) {
        console.error("Error fetching types:", error);
        setErrors("Failed to load file types. Please refresh the page.");
      } finally {
        setFetchingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  // Fetch languages from internal API
  useEffect(() => {
    const fetchLanguages = async (): Promise<void> => {
      setFetchingLanguages(true);
      try {
        const response = await fetch("/api/languages");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data: ApiLanguagesResponse = await response.json();
        setLanguages(data.languages || []);
      } catch (error: unknown) {
        console.error("Error fetching languages:", error);
        setErrors("Failed to load languages. Please refresh the page.");
      } finally {
        setFetchingLanguages(false);
      }
    };
    fetchLanguages();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setErrors(null);
    }
  };

  const validateInputs = (): boolean => {
    if (!file) {
      setErrors("Please select a file.");
      return false;
    }

    if (!selectedType) {
      setErrors("Please select a type.");
      return false;
    }

    if (!selectedLanguage) {
      setErrors("Please select a language.");
      return false;
    }

    const selectedTypeObj: FileType | undefined = types.find(
      (t: FileType) => t.codename === selectedType
    );
    if (!selectedTypeObj) {
      setErrors("Invalid type selected.");
      return false;
    }

    const selectedLanguageObj: Language | undefined = languages.find(
      (e: Language) => e.codename === selectedLanguage
    );
    if (!selectedLanguageObj) {
      setErrors("Invalid language selected.");
      return false;
    }
   

    if (file.name !== `${selectedTypeObj.codename}.csv`) {
      setErrors(`Filename must be "${selectedTypeObj.codename}.csv".`);
      return false;
    }

    return true;
  };

  const handleUpload = async (): Promise<void> => {
    // Reset previous results
    setUploadResult(null);
    setErrors(null);

    if (!validateInputs()) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("environment", environment);
    formData.append("type", selectedType);

    setLoading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.message || "Error uploading file.");
      } else {
        setUploadResult(result as UploadResponse);
      }
    } catch (error: unknown) {
      console.error("Error uploading file", error);
      setErrors("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setFile(null);
    setSelectedType("");
    setUploadResult(null);
    setErrors(null);
    // Reset file input by recreating it
    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // const getSelectedTypeName = (): string => {
  //   const type: FileType | undefined = types.find(
  //     (t: FileType) => t.codename === selectedType
  //   );
  //   return type ? type.name : selectedType;
  // };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">
        PickList Bulk Uploader
      </h2>

      <p className="text-gray-700 mb-4">
        Upload a CSV file to bulk import items into your PickList. Ensure the
        file is named correctly based on the selected type.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Download Template for &nbsp;
        <span className="font-semibold">
          {environment === "dev" ? "Development" : "Production"}
        </span>:
        <a href={`/api/getSampleTemplate`} target="_blank" rel="noopener noreferrer"
          download
          aria-label="Download sample template" 
           className="button bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white  ml-1">Sample Template</a>
           
      </p>
      
      {!uploadResult && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                className="block text-sm font-medium text-black"
                htmlFor="fileInput"
              >
                Upload CSV File
              </label>
              {/* {file && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">{file.name}</span>
                  <button
                    onClick={(): void => setFile(null)}
                    className="text-gray-500 hover:text-red-500"
                    title="Remove file"
                    type="button"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )} */}
            </div>

            <label
              htmlFor="fileInput"
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                file
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <Upload
                className={file ? "text-green-500" : "text-gray-400"}
                size={32}
              />
              <span className="mt-2 text-sm text-gray-600">
                {file
                  ? file.name
                  : "Click to select a CSV file or drag and drop"}
              </span>
              <input
                id="fileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* Configuration Section */}
          <div className="columns-3 gap-4">
            {/* Environment Selection */}
            <div className="relative ">
              <label
                className="block text-sm font-medium mb-1 text-black"
                htmlFor="environmentSelect"
              >
                Environment
              </label>
              <select
                id="environmentSelect"
                value={environment}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                  setEnvironment(e.target.value)
                }
                className="block w-full bg-white appearance-none border border-gray-300 text-black p-2 rounded leading-tight focus:outline-none focus:border-blue-500"
                disabled={loading}
              >
                <option value="dev">Development</option>
                <option value="prod">Production</option>
              </select>
              <div className="pointer-events-none absolute top-8 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Type Selection */}
            <div className="relative ">
              <label
                className="block text-sm font-medium mb-1 text-black"
                htmlFor="typeSelect"
              >
                File Type
              </label>
              <select
                id="typeSelect"
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                  setSelectedType(e.target.value)
                }
                className="block w-full bg-white appearance-none border border-gray-300 text-black p-2 rounded leading-tight focus:outline-none focus:border-blue-500"
                disabled={fetchingTypes || types.length === 0 || loading}
              >
                <option value="">Select a type</option>
                {types.map((type: FileType) => (
                  <option key={type.codename} value={type.codename}>
                    {type.name}
                  </option>
                ))}
              </select>

              
              <div className="pointer-events-none absolute top-8 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {fetchingTypes && (
                <div className="text-xs text-gray-500 mt-1">
                  Loading types...
                </div>
              )}
              {!fetchingTypes && types.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No file types available
                </p>
              )}
            </div>
            
            {/* Language Selection */}
            <div className="relative ">
                <label
                  className="block text-sm font-medium mb-1 text-black"
                  htmlFor="languageSelect">Languages</label>
                <select
                  id="languageSelect"
                  value={selectedLanguage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                    setSelectedLanguage(e.target.value)
                  }
                  className="block w-full bg-white appearance-none border border-gray-300 text-black p-2 rounded leading-tight focus:outline-none focus:border-blue-500"
                >
                  {/* <option value="default">Default Language</option> */}
                  {languages.map((language: Language) => (
                    <option key={language.codename} value={language.codename}>
                      {language.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-8 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {fetchingLanguages && (
                <div className="text-xs text-gray-500 mt-1">
                  Loading languages...
                </div>
              )}
              {!fetchingLanguages && languages.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No language available
                </p>
              )}
              </div>

          </div>

          {/* Error Message */}
          {errors && (
            <div
              className="flex items-center p-3 bg-red-50 border border-red-200 rounded text-red-800"
              role="alert"
            >
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-sm">{errors}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-orange-500 text-white rounded transition-colors hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !file || !selectedType}
              type="button"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>

            <ExportButton
              environment={environment}
              systemType={selectedType}
              //languageCodename={selectedLanguage}
              disabled={!environment || !selectedType}
            />

            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={loading}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {uploadResult && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center mb-4">
            <CheckCircle size={24} className="text-green-500 mr-2" />
            <h3 className="text-xl font-semibold text-black">
              Upload Complete
            </h3>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded mb-4 text-black">
            <p>{uploadResult.message}</p>
            <div className="flex space-x-8 mt-2">
              <div>
                <span className="text-sm text-gray-600">Processed:</span>
                <span
                  className={`ml-2 font-semibold ${
                    uploadResult.processedCount <= 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {uploadResult.processedCount} records
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Unprocessed:</span>
                <span
                  className={`ml-2 font-semibold ${
                    uploadResult.unprocessedCount > 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {uploadResult.unprocessedCount} records
                </span>
              </div>
            </div>
          </div>

          {uploadResult.unprocessedCount > 0 &&
            uploadResult.unprocessedRecords && (
              <div>
                <h4 className="font-medium mb-2">Unprocessed Records:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {uploadResult.unprocessedRecords.map(
                        (record: UnprocessedRecord, index: number) => (
                          <tr key={index} className="bg-white">
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {record.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-red-600">
                              {record.reason}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          <div className="flex justify-between mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              type="button"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}

      {/* Info Block */}
      {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
        <p className="font-medium mb-1">File Name Requirements:</p>
        <p>
          The filename must match the selected type codename (e.g., "
          {selectedType ? `${selectedType}.csv` : "typename.csv"}"). If you
          selected {selectedType ? getSelectedTypeName() : "a type"}, your file
          should be named{" "}
          {selectedType ? `"${selectedType}.csv"` : '"typename.csv"'}.
        </p>
      </div> */}
    </div>
  );
}
