import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";

interface DeleteButtonProps {
  /** Used in the confirmation ("Delete John Smith?") and the accessible label. */
  itemName: string;
  onConfirm: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Tooltip explaining why the button is disabled. */
  disabledReason?: string;
  /** What deleting does, shown in the confirmation. */
  description?: string;
  /** Text for a labelled button, such as in a page header; without it, an icon button for tables. */
  label?: string;
}

/** Delete button that asks for confirmation first. */
export function DeleteButton({
  itemName,
  onConfirm,
  loading,
  disabled,
  disabledReason,
  description = "This cannot be undone.",
  label,
}: DeleteButtonProps) {
  const button = label ? (
    <Button danger icon={<DeleteOutlined />} loading={loading} disabled={disabled}>
      {label}
    </Button>
  ) : (
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      aria-label={`Delete ${itemName}`}
      loading={loading}
      disabled={disabled}
    />
  );

  if (disabled) {
    return <Tooltip title={disabledReason}>{button}</Tooltip>;
  }

  return (
    <Popconfirm
      title={`Delete ${itemName}?`}
      description={<div className="confirm-text">{description}</div>}
      okText="Delete"
      okButtonProps={{ danger: true }}
      onConfirm={onConfirm}
    >
      {label ? button : <Tooltip title="Delete">{button}</Tooltip>}
    </Popconfirm>
  );
}
