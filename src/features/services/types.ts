import type { UploadFile } from "antd";

export interface ServiceImage {
  id: number;
  file_name: string;
}

export interface Service {
  id: number;
  name: string;
  abbreviation?: string | null;
  price?: number | string | null;
  description?: string | null;
  service_attachments?: ServiceImage[] | null;
}

export interface ServiceFormValues {
  name: string;
  abbreviation: string;
  price: number;
  description: string;
  images?: UploadFile[];
}

export type ServiceInput = Omit<ServiceFormValues, "images">;
