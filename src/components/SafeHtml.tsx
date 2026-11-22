import DOMPurify from "dompurify";
import { useMemo } from "react";

interface SafeHtmlProps {
  html: string | null | undefined;
  className?: string;
}

/** Renders HTML from the API after removing scripts, event handlers and other unsafe markup. */
export function SafeHtml({ html, className = "rich-text" }: SafeHtmlProps) {
  const sanitized = useMemo(() => DOMPurify.sanitize(html ?? ""), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
