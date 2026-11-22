import { Button, Form, Space } from "antd";

interface FormActionsProps {
  onCancel: () => void;
  submitting?: boolean;
  submitLabel?: string;
  /** Disables the submit button, for example until something has changed. */
  submitDisabled?: boolean;
}

/** Submit and Cancel buttons used at the bottom of every form. */
export function FormActions({
  onCancel,
  submitting = false,
  submitLabel = "Save",
  submitDisabled = false,
}: FormActionsProps) {
  return (
    <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
      <Space>
        <Button type="primary" htmlType="submit" loading={submitting} disabled={submitDisabled}>
          {submitLabel}
        </Button>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </Space>
    </Form.Item>
  );
}
