import type { PropertyValues } from "./types";

/** Empty optional fields go to the API as null, so clearing a field clears it. */
export function toPropertyBody(values: PropertyValues): PropertyValues {
  const optional = (value: string | null | undefined) => (value?.trim() ? value.trim() : null);
  return {
    ...values,
    ownerName: values.ownerName.trim(),
    ownerEmail: values.ownerEmail.trim(),
    ownerPhone: values.ownerPhone.trim(),
    addressLine1: values.addressLine1.trim(),
    city: values.city.trim(),
    postalCode: values.postalCode.trim(),
    ownerAltEmail: optional(values.ownerAltEmail),
    ownerAltPhone: optional(values.ownerAltPhone),
    addressLine2: optional(values.addressLine2),
  };
}
