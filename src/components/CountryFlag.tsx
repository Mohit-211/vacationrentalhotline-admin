import { GlobalOutlined } from "@ant-design/icons";

/** Country names the API returns, mapped to ISO 3166 codes. Add entries as new markets appear. */
const COUNTRY_CODES: Record<string, string> = {
  canada: "CA",
  "united states": "US",
  "united states of america": "US",
  usa: "US",
};

/** Emoji flag for a country name, or a globe icon when the country is unknown. */
export function CountryFlag({ country }: { country: string }) {
  const code = COUNTRY_CODES[country.trim().toLowerCase()];
  if (!code) {
    return <GlobalOutlined aria-hidden />;
  }
  const flag = String.fromCodePoint(
    ...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
  return (
    <span role="img" aria-label={`${country} flag`}>
      {flag}
    </span>
  );
}
