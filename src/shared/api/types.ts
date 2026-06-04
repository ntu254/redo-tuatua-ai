export interface ApiConfig {
  baseUrl: string;
  useMockApi: boolean;
  mockDelayMs: number;
  klingBaseUrl: string;
  klingAccessKey: string;
  klingSecretKey: string;
}

export interface ApiRequestOptions extends RequestInit {
  json?: unknown;
  path?: string;
}

export type MockHandler = (
  options: ApiRequestOptions,
) => unknown | Promise<unknown>;
