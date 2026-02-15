import axios from "axios";

/**
 * Minimal shape needed by exportCSVList
 */
export interface DeliveryItem {
  system?: {
    id?: string;
    codename?: string;
    type?: string;
  };
  elements?: {
    title?: {
      value?: string;
    };
  };
}

interface FetchItemsParams {
  projectId: string;
  deliveryApiKey: string;
  deliveryBaseUrl: string;
  systemType: string;
  language: string;
}

interface DeliveryResponse {
  items: DeliveryItem[];
  continuationToken?: string;
}

/**
 * Fetch all items for a given system.type and language
 * using Delivery API with pagination support.
 */
export async function fetchItemsByLanguage(
  params: FetchItemsParams
): Promise<DeliveryItem[]> {
  const {
    projectId,
    deliveryApiKey,
    deliveryBaseUrl,
    systemType,
    language,
  } = params;

  const allItems: DeliveryItem[] = [];
  let continuationToken: string | undefined = undefined;

  do {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${deliveryApiKey}`,
    };

    if (continuationToken) {
      headers["x-continuation"] = continuationToken;
    }

    const response = await axios.get<DeliveryResponse>(
      `${deliveryBaseUrl}/${projectId}/items`,
      {
        headers,
        params: {
          "system.type": systemType,
          language,
        },
      }
    );

    const data = response.data;

    if (Array.isArray(data.items)) {
      allItems.push(...data.items);
    }

    continuationToken = data.continuationToken;
  } while (continuationToken);

  return allItems;
}
