/**
 * An IP address as people write it: "0000:0000:0000:0000:0000:0000:0000:0001" becomes "::1",
 * and an IPv4 address carried in IPv6 ("::ffff:73.12.34.56") becomes "73.12.34.56".
 */
export function formatIpAddress(ip: string | null | undefined): string | null {
  if (!ip) return null;
  if (!ip.includes(":")) return ip;
  const mapped = /^(?:0{0,4}:){0,5}ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip.replace(/^::/, "0:"));
  if (mapped) return mapped[1];
  const groups = ip.split(":");
  if (groups.length !== 8) return ip.toLowerCase();
  const short = groups.map((group) => group.replace(/^0+(?=.)/, "").toLowerCase());
  // Collapse the longest run of two or more zero groups into "::".
  let runStart = -1;
  let runLength = 0;
  for (let start = 0; start < 8;) {
    let end = start;
    while (end < 8 && short[end] === "0") end += 1;
    if (end - start > Math.max(1, runLength)) {
      runStart = start;
      runLength = end - start;
    }
    start = end === start ? start + 1 : end;
  }
  if (runStart < 0) return short.join(":");
  return `${short.slice(0, runStart).join(":")}::${short.slice(runStart + runLength).join(":")}`;
}
