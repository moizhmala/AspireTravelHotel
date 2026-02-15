import { JSX, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/router";
import { ExportButton } from "../components/ExportButton";

/* ===================== Types ===================== */
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

type ActiveTab = "picklist" | "headerFooter" | "export";

/* ===================== Component ===================== */
export default function Home(): JSX.Element {
  const router = useRouter();

  /* ---------- Global State ---------- */
  const [activeTab, setActiveTab] = useState<ActiveTab>("picklist");
  const [environment, setEnvironment] = useState<string>("dev");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  /* ---------- Picklist State ---------- */
  const [types, setTypes] = useState<FileType[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [fetchingTypes, setFetchingTypes] = useState(true);
  const [fetchingLanguages, setFetchingLanguages] = useState(true);

  /* ---------- Header / Footer State ---------- */
  const [hfType, setHfType] = useState<"email" | "web" | "">("");

  /* ===================== Effects ===================== */
  useEffect(() => {
    setEnvironment(router.asPath === "/prod" ? "prod" : "dev");
  }, [router.asPath]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/types");
        const data = await res.json();
        setTypes(data.types || []);
      } finally {
        setFetchingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("/api/languages");
        const data = await res.json();
        setLanguages(data.languages || []);
      } finally {
        setFetchingLanguages(false);
      }
    };
    fetchLanguages();
  }, []);

  /* Reset form when switching tabs */
  useEffect(() => {
    setFile(null);
    setErrors(null);
    setUploadResult(null);
  }, [activeTab]);

  /* ===================== Handlers ===================== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setErrors(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedType || !selectedLanguage) {
      setErrors("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("environment", environment);
    formData.append("type", selectedType);
    formData.append("language", selectedLanguage);

    setLoading(true);
    try {
      const res = await fetch("/api/uploadpicklist", { method: "POST", body: formData });
      const result = await res.json();
      res.ok ? setUploadResult(result) : setErrors(result.message);
    } finally {
      setLoading(false);
    }
  };

  /* TODO: Connect to your backend */
  const handleHeaderFooterUpload = async () => {
    if (!file || !hfType) {
      setErrors("File and type are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("environment", environment);
    formData.append("type", hfType);

    setLoading(true);
    try {
      const res = await fetch("/api/uploadheaderfooter", { method: "POST", body: formData });
      const result = await res.json();
      res.ok ? setUploadResult(result) : setErrors(result.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== Reusable UI ===================== */
  const FileUpload = () => (
    <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer">
      <Upload size={32} />
      <span className="mt-2 text-sm">{file ? file.name : "Upload CSV"}</span>
      <input type="file" accept=".csv" hidden onChange={handleFileChange} />
    </label>
  );

  const EnvironmentSelect = () => (
    <select
      value={environment}
      onChange={(e) => setEnvironment(e.target.value)}
      className="border p-2 rounded bg-gray-500"
    >
      <option value="dev">Development</option>
      <option value="prod">Production</option>
    </select>
  );

  /* ===================== JSX ===================== */
  return (
    <div className="p-6 max-w-5xl mx-auto rounded-xl shadow">

      {/* ---------- Tabs ---------- */}
      <div className="flex border-b mb-6 bg-white rounded">
        {[
          ["picklist", "Picklist Upload"],
          ["headerFooter", "Header / Footer Upload"],
          ["export", "Export"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as ActiveTab)}
            className={`px-4 py-2 border-b-2 ${
              activeTab === id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------- Picklist Tab ---------- */}
      {activeTab === "picklist" && (
        <div className="space-y-6 bg-gray-500 rounded p-4">
          <FileUpload />
          <div className="grid grid-cols-4 gap-4">
            <EnvironmentSelect />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border p-2 rounded bg-gray-500"
              disabled={fetchingTypes}
            >
              <option value="">File Type</option>
              {types.map(t => (
                <option key={t.codename} value={t.codename}>{t.name}</option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border p-2 rounded bg-gray-500"
              disabled={fetchingLanguages}
            >
              <option value="">Language</option>
              {languages.map(l => (
                <option key={l.codename} value={l.codename}>{l.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Upload Picklist
          </button>
        </div>
      )}

      {/* ---------- Header / Footer Tab ---------- */}
      {activeTab === "headerFooter" && (
        <div className="space-y-6 bg-gray-500 rounded p-4">
          <FileUpload />
          <div className="grid grid-cols-3 gap-4">
            <EnvironmentSelect />
            <select
              value={hfType}
              onChange={(e) => setHfType(e.target.value as any)}
              className="border p-2 rounded bg-gray-500"
            >
              <option value="">Type</option>
              <option value="email">Email</option>
              <option value="web">Web</option>
            </select>
          </div>

          <button
            onClick={handleHeaderFooterUpload}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Upload Header / Footer
          </button>
        </div>
      )}

      {/* ---------- Export Tab ---------- */}
      {activeTab === "export" && (
        <div className="space-y-6 bg-gray-500 rounded p-4">
          <div className="grid grid-cols-3 gap-4">
            <EnvironmentSelect />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border p-2 rounded bg-gray-500"
            >
              <option value="">File Type</option>
              {types.map(t => (
                <option key={t.codename} value={t.codename}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-300 mb-2 flex gap-4 items-center">
            
            <ExportButton
            environment={environment}
            systemType={selectedType}
            //languageCodename={selectedLanguage}
            disabled={!selectedType}
          /> * Exported file will be in CSV format with UTF-8 encoding.
          </div>
          
        </div>
      )}

      {/* ---------- Errors ---------- */}
      {errors && (
        <div className="mt-4 flex items-center text-red-600">
          <AlertCircle size={18} className="mr-2" /> {errors}
        </div>
      )}

      {/* ---------- Result ---------- */}
      {uploadResult && (
        <div className="mt-6 text-green-700">
          <CheckCircle className="inline mr-2" />
          {uploadResult.message}
        </div>
      )}
    </div>
  );
}
