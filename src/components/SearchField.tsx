import { Input } from "antd";
import { useEffect, useState } from "react";

interface SearchFieldProps {
  /** The search in effect (from the URL). */
  value: string;
  onSearch: (value: string) => void;
  placeholder: string;
  /** Accessible name, such as "Search customers". */
  label: string;
}

/** Search box for server-side lists: searches 300 ms after typing stops, or on Enter. */
export function SearchField({ value, onSearch, placeholder, label }: SearchFieldProps) {
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Follow outside changes (such as the back button) without overwriting what is being typed.
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  useEffect(() => {
    if (text.trim() === value) return;
    const timer = window.setTimeout(() => onSearch(text), 300);
    return () => window.clearTimeout(timer);
  }, [text, value, onSearch]);

  return (
    <Input.Search
      allowClear
      value={text}
      placeholder={placeholder}
      aria-label={label}
      onChange={(event) => setText(event.target.value)}
      onSearch={(next) => onSearch(next)}
      className="toolbar-search"
    />
  );
}
