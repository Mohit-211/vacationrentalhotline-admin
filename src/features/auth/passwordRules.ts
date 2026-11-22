import type { FormRule } from "antd";

/** The API's password rule: 8-128 characters with at least one letter and one number. */
export const newPasswordRules: FormRule[] = [
  { required: true, message: "Enter a new password" },
  { min: 8, message: "Use at least 8 characters" },
  { max: 128, message: "Use at most 128 characters" },
  {
    validator: (_, value?: string) =>
      !value || (/[A-Za-z]/.test(value) && /\d/.test(value))
        ? Promise.resolve()
        : Promise.reject(new Error("Include at least one letter and one number")),
  },
];

/** "Confirm password" must repeat the field named `passwordField`. */
export function confirmPasswordRules(passwordField: string): FormRule[] {
  return [
    { required: true, message: "Enter the new password again" },
    ({ getFieldValue }) => ({
      validator: (_, value?: string) =>
        !value || value === getFieldValue(passwordField)
          ? Promise.resolve()
          : Promise.reject(new Error("The passwords do not match")),
    }),
  ];
}
