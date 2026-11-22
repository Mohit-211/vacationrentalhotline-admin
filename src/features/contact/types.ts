/** A message someone sent through the website's contact form. */
export interface ContactSubmission {
  id: number;
  name?: string | null;
  email?: string | null;
  contact_number?: string | null;
  requirements?: string | null;
  created_at?: string | null;
}
