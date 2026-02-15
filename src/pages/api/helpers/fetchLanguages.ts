import axios from "axios";

interface KontentLanguage {
  codename: string;
}
export async function fetchLanguages(
  projectId: string,
  baseUrl: string,
  apiKey: string
): Promise<string[]> {
  const response = await axios.get(`${baseUrl}/${projectId}/languages`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  return response.data.languages.map(
    (lang: KontentLanguage) => lang.codename
  );
}
