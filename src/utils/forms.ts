import type { FormInstance } from "antd";
import { getFieldErrors } from "./errors";

/**
 * Shows the API's per-field messages (400 VALIDATION_FAILED) under the matching form fields.
 * Returns whether any field on the form got a message, so the caller can fall back to a toast.
 * `prefix` strips a path the form doesn't have, such as "properties.0" for a one-item list.
 */
export function showFieldErrors(form: FormInstance, error: unknown, prefix?: string): boolean {
  // The fields this form renders (mounted fields, including empty ones).
  const mounted = new Set(Object.keys(form.getFieldsValue() as Record<string, unknown>));
  const fields = Object.entries(getFieldErrors(error))
    .map(([path, errors]) => ({
      name: prefix && path.startsWith(`${prefix}.`) ? path.slice(prefix.length + 1) : path,
      errors,
    }))
    .filter(({ name }) => mounted.has(name.split(".")[0]));
  form.setFields(fields.map(({ name, errors }) => ({ name: name.split("."), errors })));
  return fields.length > 0;
}
