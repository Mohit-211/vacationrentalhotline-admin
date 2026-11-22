export type ContentSectionKey = "terms" | "about";

/** A page of text shown in the app, such as the terms and conditions. */
export interface ContentEntry {
  id: number;
  heading?: string | null;
  description?: string | null;
  updated_at?: string | null;
}

export interface ContentFormValues {
  heading?: string;
  description: string;
}
