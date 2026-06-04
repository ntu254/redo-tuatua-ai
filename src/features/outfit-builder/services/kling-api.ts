import { apiConfig } from "@/shared/api";

export class KlingApiError extends Error {
  code?: number;
  requestId?: string;

  constructor(message: string, options?: { code?: number; requestId?: string }) {
    super(message);
    this.name = "KlingApiError";
    this.code = options?.code;
    this.requestId = options?.requestId;
  }
}

export interface KlingTaskResult {
  taskId: string;
  taskStatus: string;
  taskStatusMsg?: string;
  images?: { index: number; url: string }[];
  createdAt: number;
  updatedAt: number;
}

const base64UrlEncode = (str: string): string => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const generateJwtToken = async (accessKey: string, secretKey: string): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5,
  }));

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${payload}`));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${header}.${payload}.${signatureBase64}`;
};

const headers = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await generateJwtToken(apiConfig.klingAccessKey, apiConfig.klingSecretKey)}`,
});

const stripBase64Prefix = (dataUrl: string): string => {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return dataUrl;
  return dataUrl.substring(commaIndex + 1);
};

export const klingApi = {
  createTryOnTask: async (humanImage: string, clothImage: string): Promise<{ taskId: string }> => {
    const baseUrl = apiConfig.klingBaseUrl;

    const body = {
      model_name: "kolors-virtual-try-on-v1-5",
      human_image: humanImage.startsWith("data:") ? stripBase64Prefix(humanImage) : humanImage,
      cloth_image: clothImage.startsWith("data:") ? stripBase64Prefix(clothImage) : clothImage,
    };

    const response = await fetch(`${baseUrl}/v1/images/kolors-virtual-try-on`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (json.code !== 0) {
      throw new KlingApiError(json.message || "Failed to create try-on task", {
        code: json.code,
        requestId: json.request_id,
      });
    }

    return { taskId: json.data.task_id };
  },

  getTaskStatus: async (taskId: string): Promise<KlingTaskResult> => {
    const baseUrl = apiConfig.klingBaseUrl;

    const response = await fetch(`${baseUrl}/v1/images/kolors-virtual-try-on/${taskId}`, {
      method: "GET",
      headers: await headers(),
    });

    const json = await response.json();

    if (json.code !== 0) {
      throw new KlingApiError(json.message || "Failed to get task status", {
        code: json.code,
        requestId: json.request_id,
      });
    }

    const data = json.data;
    return {
      taskId: data.task_id,
      taskStatus: data.task_status,
      taskStatusMsg: data.task_status_msg,
      images: data.task_result?.images,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
};
