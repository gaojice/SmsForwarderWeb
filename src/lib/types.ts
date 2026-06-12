// Settings
export interface AppSettings {
  serverUrl: string;
  secret: string;
}

// API Request/Response
export interface ApiRequest<T = unknown> {
  data: T;
  timestamp: number;
  sign?: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
  timestamp: number;
  sign?: string;
}

// Config Query
export interface SimInfo {
  carrier_name: string;
  country_iso: string;
  icc_id: string;
  number: string;
  sim_slot_index: number;
  subscription_id: number;
}

export interface ConfigQueryResponse {
  enable_api_battery_query: boolean;
  enable_api_call_query: boolean;
  enable_api_clone: boolean;
  enable_api_contact_query: boolean;
  enable_api_sms_query: boolean;
  enable_api_sms_send: boolean;
  enable_api_wol: boolean;
  extra_device_mark?: string;
  extra_sim1?: string;
  extra_sim2?: string;
  sim_info_list?: Record<string, SimInfo>;
}

// SMS
export interface SmsSendRequest {
  sim_slot: 1 | 2;
  phone_numbers: string;
  msg_content: string;
}

export interface SmsQueryRequest {
  type: 1 | 2;
  page_num: number;
  page_size: number;
  keyword?: string;
}

export interface SmsItem {
  content: string;
  number: string;
  name: string;
  type: number;
  date: number;
  sim_id: number;
  sub_id: number;
}

// Call
export interface CallQueryRequest {
  type: 0 | 1 | 2 | 3;
  page_num: number;
  page_size: number;
  phone_number?: string;
}

export interface CallItem {
  name?: string;
  number: string;
  dateLong: number;
  duration: number;
  type: number;
  sim_id: number;
}

// Contact
export interface ContactQueryRequest {
  phone_number?: string;
  name?: string;
}

export interface ContactItem {
  name?: string;
  phone_number: string;
}

export interface ContactAddRequest {
  phone_number: string;
  name?: string;
}

// Battery
export interface BatteryResponse {
  level: string;
  scale?: string;
  voltage?: string;
  temperature?: string;
  status: string;
  health: string;
  plugged: string;
}

// WOL
export interface WolRequest {
  mac: string;
  ip?: string;
  port?: number;
}

// Location
export interface LocationResponse {
  address?: string;
  latitude: number;
  longitude: number;
  provider?: string;
  time: string;
}
