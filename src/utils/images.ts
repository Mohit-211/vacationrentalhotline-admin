import type { UploadFile } from "antd";
import imageCompression from "browser-image-compression";
import { env } from "@/config/env";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const COMPRESSION_THRESHOLD_BYTES = 1024 * 1024;
const STORED_IMAGE_UID_PREFIX = "stored-";

export function isAcceptedImage(file: { type?: string }): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type ?? "");
}

/** Public URL of an image uploaded through the API. */
export function assetUrl(fileName: string): string {
  return `${env.assetsBaseUrl}${fileName}`;
}

/** Shrinks images over 1 MB to at most 1920 px on the long side, keeping their type and name. */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESSION_THRESHOLD_BYTES) return file;
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
  return new File([compressed], file.name, { type: compressed.type || file.type });
}

/** Upload-list entry for an image that already exists on the server. */
export function toStoredUploadFile(image: { id: number; file_name: string }): UploadFile {
  return {
    uid: `${STORED_IMAGE_UID_PREFIX}${image.id}`,
    name: image.file_name,
    status: "done",
    url: assetUrl(image.file_name),
  };
}

/** Splits an upload list into new (compressed) files to send and stored images the user removed. */
export async function getImageChanges(
  fileList: UploadFile[],
  storedImages: Array<{ id: number }> = [],
): Promise<{ newFiles: File[]; removedIds: number[] }> {
  const keptUids = new Set(fileList.map((file) => file.uid));
  const removedIds = storedImages
    .filter((image) => !keptUids.has(`${STORED_IMAGE_UID_PREFIX}${image.id}`))
    .map((image) => image.id);
  const newFiles = await Promise.all(
    fileList.flatMap((file) => (file.originFileObj ? [compressImage(file.originFileObj)] : [])),
  );
  return { newFiles, removedIds };
}
