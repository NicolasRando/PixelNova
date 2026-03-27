export interface Service {
  id: string;
  name: string;
  url: string;
  interval: number;
  createdAt: string;
  updatedAt: string;
  lastCheck: Check | null;
}

export interface Check {
  id: string;
  serviceId: string;
  status: "up" | "down";
  statusCode: number | null;
  latency: number | null;
  checkedAt: string;
}

export interface ChecksResponse {
  checks: Check[];
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
