type FormValue = string | number | Blob | null | undefined;

/**
 * Builds a multipart body. Arrays become repeated fields and nullish values are skipped,
 * which matches what the API's multipart endpoints expect.
 */
export function toFormData(fields: Record<string, FormValue | FormValue[]>): FormData {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item === null || item === undefined) continue;
      body.append(key, item instanceof Blob ? item : String(item));
    }
  }
  return body;
}
