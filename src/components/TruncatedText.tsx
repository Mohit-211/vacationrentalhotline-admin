import { displayValue } from "@/utils/format";

/** Long text in a table cell: one line, cut off with "…"; the full text shows on hover. */
export function TruncatedText({ text }: { text?: string | null }) {
  return (
    <span className="cell-truncate" title={text ?? undefined}>
      {displayValue(text)}
    </span>
  );
}
