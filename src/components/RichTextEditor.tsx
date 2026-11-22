import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Divider, Flex, Form, Input, Popover, Space, Tooltip } from "antd";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./RichTextEditor.module.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  "aria-label"?: string;
}

/** Rich-text field for antd forms. Emits HTML, or "" when the document is empty. */
export function RichTextEditor({
  value = "",
  onChange,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const { status } = Form.Item.useStatus();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `rich-text ${styles.content}`,
        role: "textbox",
        "aria-multiline": "true",
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      },
    },
    onUpdate: ({ editor: current }) => onChange?.(current.isEmpty ? "" : current.getHTML()),
  });

  // Apply values that change from outside, such as data loaded after the form mounted.
  useEffect(() => {
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className={`${styles.wrapper} ${status === "error" ? styles.error : ""}`}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      heading2: current.isActive("heading", { level: 2 }),
      heading3: current.isActive("heading", { level: 3 }),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      link: current.isActive("link"),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });
  const run = () => editor.chain().focus();

  return (
    <Flex className={styles.toolbar} wrap align="center" gap={2}>
      <ToolbarButton
        label="Heading"
        active={state.heading2}
        onClick={() => run().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Subheading"
        active={state.heading3}
        onClick={() => run().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <Divider orientation="vertical" />
      <ToolbarButton
        label="Bold"
        icon={<BoldOutlined />}
        active={state.bold}
        onClick={() => run().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        icon={<ItalicOutlined />}
        active={state.italic}
        onClick={() => run().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        icon={<UnderlineOutlined />}
        active={state.underline}
        onClick={() => run().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Strikethrough"
        icon={<StrikethroughOutlined />}
        active={state.strike}
        onClick={() => run().toggleStrike().run()}
      />
      <LinkButton editor={editor} active={state.link} />
      <Divider orientation="vertical" />
      <ToolbarButton
        label="Bulleted list"
        icon={<UnorderedListOutlined />}
        active={state.bulletList}
        onClick={() => run().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Numbered list"
        icon={<OrderedListOutlined />}
        active={state.orderedList}
        onClick={() => run().toggleOrderedList().run()}
      />
      <Divider orientation="vertical" />
      <ToolbarButton
        label="Undo"
        icon={<UndoOutlined />}
        disabled={!state.canUndo}
        onClick={() => run().undo().run()}
      />
      <ToolbarButton
        label="Redo"
        icon={<RedoOutlined />}
        disabled={!state.canRedo}
        onClick={() => run().redo().run()}
      />
    </Flex>
  );
}

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  children?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  label,
  onClick,
  icon,
  children,
  active = false,
  disabled,
}: ToolbarButtonProps) {
  return (
    <Tooltip title={label}>
      <Button
        type={active ? "primary" : "text"}
        size="small"
        icon={icon}
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setUrl(String(editor.getAttributes("link").href ?? ""));
    }
    setOpen(next);
  };

  const applyLink = () => {
    const chain = editor.chain().focus().extendMarkRange("link");
    const href = url.trim();
    if (href) {
      chain.setLink({ href }).run();
    } else {
      chain.unsetLink().run();
    }
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
      content={
        <Space.Compact>
          <Input
            autoFocus
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onPressEnter={applyLink}
            placeholder="https://example.com"
            aria-label="Link address"
            style={{ width: 260 }}
          />
          <Button type="primary" onClick={applyLink}>
            {url.trim() ? "Apply" : "Remove"}
          </Button>
        </Space.Compact>
      }
    >
      <Button
        type={active ? "primary" : "text"}
        size="small"
        icon={<LinkOutlined />}
        aria-label="Link"
        aria-pressed={active}
        title="Link"
      />
    </Popover>
  );
}
