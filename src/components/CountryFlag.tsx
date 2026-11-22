import { GlobalOutlined } from "@ant-design/icons";

/** Emoji flag for an ISO 3166 country code such as "US"; a globe icon for anything else. */
export function CountryFlag({ code }: { code: string | null | undefined }) {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) {
    return <GlobalOutlined aria-hidden />;
  }
  const flag = String.fromCodePoint(
    ...[...code.toUpperCase()].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
  return <span aria-hidden>{flag}</span>;
}
