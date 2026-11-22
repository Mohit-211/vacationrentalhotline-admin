import { Checkbox, Flex, Form, Input, Radio, Typography, type FormInstance } from "antd";
import { FormActions } from "@/components/FormActions";
import { roleSummary } from "@/features/roles/summary";
import type { Role } from "@/features/roles/types";
import type { NewStaffValues } from "../types";

interface StaffFormProps {
  form: FormInstance<NewStaffValues>;
  roles: Role[];
  /** Adding: also offers to email the password. */
  isNew: boolean;
  /** Editing your own account: the API won't change your own role. */
  isSelf?: boolean;
  initialValues?: Partial<NewStaffValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: NewStaffValues) => void;
  onCancel: () => void;
}

export function StaffForm({
  form,
  roles,
  isNew,
  isSelf = false,
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: StaffFormProps) {
  return (
    <Form<NewStaffValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ sendEmail: true, ...initialValues }}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Enter their name" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Enter an email address" },
          { type: "email", message: "Enter a valid email address" },
        ]}
      >
        <Input type="email" autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        extra={
          isSelf
            ? "You can't change your own role. Ask another admin."
            : isNew
              ? undefined
              : "Changing the role signs them out, so it applies at once."
        }
        rules={[{ required: true, message: "Choose a role" }]}
      >
        <Radio.Group disabled={isSelf}>
          <Flex vertical gap="small">
            {roles.map((role) => (
              <Radio key={role.name} value={role.name}>
                <Typography.Text strong>{role.label}</Typography.Text>
                <br />
                <Typography.Text type="secondary">{roleSummary(role)}</Typography.Text>
              </Radio>
            ))}
          </Flex>
        </Radio.Group>
      </Form.Item>
      {isNew && (
        <Form.Item name="sendEmail" valuePropName="checked">
          <Checkbox>Email them their password</Checkbox>
        </Form.Item>
      )}
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
