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
}

/** Icon button that asks for confirmation before deleting. */
export function DeleteButton({
  itemName,
  onConfirm,
  loading,
  disabled,
  disabledReason,
}: DeleteButtonProps) {
  const button = (
    <Button
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
      description="This cannot be undone."
      okText="Delete"
      okButtonProps={{ danger: true }}
      onConfirm={onConfirm}
    >
      <Tooltip title="Delete">{button}</Tooltip>
    </Popconfirm>
  );
}
