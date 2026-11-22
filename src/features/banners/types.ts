import type { UploadFile } from "antd";

/** An image shown on the app's home screen. */
export interface Banner {
  id: number;
  file_name: string;
}

export interface BannerFormValues {
  images: UploadFile[];
}
