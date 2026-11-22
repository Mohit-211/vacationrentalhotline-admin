import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_ZONE } from "@/config/locale";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export const EMPTY_VALUE = "—";

type DateInput = string | number | Date | null | undefined;
type NumberInput = number | string | null | undefined;

/** A moment as an Eastern-time date: "11/22/2026". */
export function formatDate(value: DateInput): string {
  return formatInTimeZone(value, DATE_FORMAT);
}

/** A moment in Eastern time: "11/22/2026 11:47 AM EST". */
export function formatDateTime(value: DateInput): string {
  return formatInTimeZone(value, DATE_TIME_FORMAT);
}

function formatInTimeZone(value: DateInput, pattern: string): string {
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  const date = dayjs(value);
  return date.isValid() ? date.tz(TIME_ZONE).format(pattern) : EMPTY_VALUE;
}

const integerFormat = new Intl.NumberFormat("en-US");
const moneyFormats = new Map<string, Intl.NumberFormat>();
const compactMoneyFormats = new Map<string, Intl.NumberFormat>();

function moneyFormat(currency: string, compact: boolean): Intl.NumberFormat {
  const cache = compact ? compactMoneyFormats : moneyFormats;
  const code = currency.toUpperCase();
  let format = cache.get(code);
  if (!format) {
    format = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      ...(compact ? { notation: "compact" } : {}),
    });
    cache.set(code, format);
  }
  return format;
}

function toNumber(value: NumberInput): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** Money from the API, which counts in cents: 25000 -> "$250.00". */
export function formatCents(cents: NumberInput, currency = "USD"): string {
  const number = toNumber(cents);
  return number === null ? EMPTY_VALUE : moneyFormat(currency, false).format(number / 100);
}

/** Short money for chart axes: 1250000 cents -> "$12.5K". */
export function formatCompactCents(cents: NumberInput, currency = "USD"): string {
  const number = toNumber(cents);
  return number === null ? EMPTY_VALUE : moneyFormat(currency, true).format(number / 100);
}

export function formatNumber(value: NumberInput): string {
  const number = toNumber(value);
  return number === null ? EMPTY_VALUE : integerFormat.format(number);
}

/** Shows a dash for missing values so empty cells look intentional. */
export function displayValue(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === "" ? EMPTY_VALUE : String(value);
}

/**
 * Codes from the API as readable labels: "ADMIN" -> "Admin", "bank_transfer" -> "Bank transfer",
 * "succeeded" -> "Succeeded". Used for roles, payment statuses and payment methods.
 */
export function formatLabel(value: string | null | undefined): string {
  const words = (value ?? "")
    .trim()
    .replace(/[_\s]+/g, " ")
    .toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : EMPTY_VALUE;
}

/**
 * Phone numbers are stored as typed, usually "+15125550111". US and Canadian numbers read as
 * "+1 (512) 555-0111"; anything else is shown as stored.
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value?.trim()) return EMPTY_VALUE;
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(value.replace(/[^\d+]/g, ""));
  return match ? `+1 (${match[1]}) ${match[2]}-${match[3]}` : value;
}
