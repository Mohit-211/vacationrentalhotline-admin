import { Alert, Modal, Typography } from "antd";

interface PasswordDialogProps {
  /** The generated password; the dialog is open while it is set. */
  password: string | null;
  /** Whose password it is, such as "Ada Lovelace". */
  accountName: string;
  /** Whether the API also emailed it. */
  emailed: boolean;
  onClose: () => void;
}

/**
 * Shows a password the API generated, once. It isn't stored anywhere: after closing, it is gone.
 */
export function PasswordDialog({ password, accountName, emailed, onClose }: PasswordDialogProps) {
  return (
    <Modal
      open={password !== null}
      title={`Password for ${accountName}`}
      okText="Done"
      onOk={onClose}
      onCancel={onClose}
      cancelButtonProps={{ hidden: true }}
      mask={{ closable: false }}
      destroyOnHidden
    >
      <Typography.Paragraph>
        {emailed
          ? "We emailed this password to them. You can also copy it and pass it on yourself."
          : "Copy this password and pass it on. It was not emailed."}
      </Typography.Paragraph>
      <Typography.Paragraph className="password-box" copyable={{ text: password ?? "" }} code>
        {password}
      </Typography.Paragraph>
      <Alert
        type="warning"
        showIcon
        title="This is the only time the password is shown. Once you close this, it is gone."
      />
    </Modal>
  );
}
