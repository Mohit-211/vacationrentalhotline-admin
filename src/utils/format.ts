import dayjs from "dayjs";

export const EMPTY_VALUE = "—";

type DateInput = string | number | Date | null | undefined;
type NumberInput = number | string | null | undefined;

export function formatDate(value: DateInput): string {
  return formatDayjs(value, "DD MMM YYYY");
}

export function formatDateTime(value: DateInput): string {
  return formatDayjs(value, "DD MMM YYYY, HH:mm");
}

function formatDayjs(value: DateInput, pattern: string): string {
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  const date = dayjs(value);
  return date.isValid() ? date.format(pattern) : EMPTY_VALUE;
}

const currencyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compactCurrencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});
const integerFormat = new Intl.NumberFormat("en-US");

function toNumber(value: NumberInput): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatCurrency(value: NumberInput): string {
  const number = toNumber(value);
  return number === null ? EMPTY_VALUE : currencyFormat.format(number);
}

export function formatCompactCurrency(value: NumberInput): string {
  const number = toNumber(value);
  return number === null ? EMPTY_VALUE : compactCurrencyFormat.format(number);
}

export function formatNumber(value: NumberInput): string {
  const number = toNumber(value);
  return number === null ? EMPTY_VALUE : integerFormat.format(number);
}

/** Shows a dash for missing values so empty cells look intentional. */
export function displayValue(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === "" ? EMPTY_VALUE : String(value);
}
