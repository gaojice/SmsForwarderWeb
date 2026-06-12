import { generateSign } from "./sign";
import { REQUEST_TIMEOUT_MS } from "./constants";
import type { AppSettings, ApiRequest, ApiResponse } from "./types";

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  data: unknown,
  settings: AppSettings
): Promise<T> {
  const { serverUrl, secret } = settings;

  if (!serverUrl) {
    throw new ApiError(0, "服务器地址未配置", endpoint);
  }

  const timestamp = Date.now();
  const sign = secret ? await generateSign(secret, timestamp) : "";

  const body: ApiRequest = {
    data,
    timestamp,
    sign,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `${serverUrl.replace(/\/$/, "")}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`, endpoint);
    }

    const result: ApiResponse<T> = await response.json();

    if (result.code !== 200) {
      throw new ApiError(result.code, result.msg || "请求失败", endpoint);
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(0, "请求超时", endpoint);
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(0, "网络错误：无法连接设备", endpoint);
    }

    throw new ApiError(0, error instanceof Error ? error.message : "未知错误", endpoint);
  }
}

// Convenience API functions
export const api = {
  configQuery: (settings: AppSettings) =>
    apiRequest<import("./types").ConfigQueryResponse>("/config/query", {}, settings),

  smsSend: (data: import("./types").SmsSendRequest, settings: AppSettings) =>
    apiRequest<string>("/sms/send", data, settings),

  smsQuery: (data: import("./types").SmsQueryRequest, settings: AppSettings) =>
    apiRequest<import("./types").SmsItem[]>("/sms/query", data, settings),

  callQuery: (data: import("./types").CallQueryRequest, settings: AppSettings) =>
    apiRequest<import("./types").CallItem[]>("/call/query", data, settings),

  contactQuery: (data: import("./types").ContactQueryRequest, settings: AppSettings) =>
    apiRequest<import("./types").ContactItem[]>("/contact/query", data, settings),

  contactAdd: (data: import("./types").ContactAddRequest, settings: AppSettings) =>
    apiRequest<string>("/contact/add", data, settings),

  batteryQuery: (settings: AppSettings) =>
    apiRequest<import("./types").BatteryResponse>("/battery/query", {}, settings),

  wolSend: (data: import("./types").WolRequest, settings: AppSettings) =>
    apiRequest<string>("/wol/send", data, settings),

  locationQuery: (settings: AppSettings) =>
    apiRequest<import("./types").LocationResponse>("/location/query", {}, settings),
};
