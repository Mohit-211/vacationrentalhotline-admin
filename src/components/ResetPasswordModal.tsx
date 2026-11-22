import { Checkbox, Modal, Typography } from "antd";
import { useState } from "react";

interface ResetPasswordModalProps {
  open: boolean;
  accountName: string;
  loading: boolean;
  onConfirm: (sendEmail: boolean) => void;
  onCancel: () => void;
}

/** Confirms a password reset; the API generates the new password and signs the person out. */
export function ResetPasswordModal({
  open,
  accountName,
  loading,
  onConfirm,
  onCancel,
}: ResetPasswordModalProps) {
  const [sendEmail, setSendEmail] = useState(true);
  return (
    <Modal
      open={open}
      title={`Reset ${accountName}'s password?`}
      okText="Reset password"
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
      onOk={() => onConfirm(sendEmail)}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Typography.Paragraph>
        A new password is generated and shown to you once. They are signed out everywhere and need
        the new password to sign in again.
      </Typography.Paragraph>
      <Checkbox checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)}>
        Email the new password to them
      </Checkbox>
    </Modal>
  );
}
