import { Form, Input, Radio, Space, Typography } from "antd";
import { FormActions } from "@/components/FormActions";
import { ADMIN_ROLE_OPTIONS, type AdminFormValues } from "../types";

interface AdminFormProps {
  initialValues?: Partial<AdminFormValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: AdminFormValues) => void;
  onCancel: () => void;
}

export function AdminForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: AdminFormProps) {
  return (
    <Form<AdminFormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Enter the admin's name" }]}
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
      <Form.Item label="Role" name="roleId" rules={[{ required: true, message: "Choose a role" }]}>
        <Radio.Group>
          <Space orientation="vertical">
            {ADMIN_ROLE_OPTIONS.map((role) => (
              <Radio key={role.id} value={role.id}>
                <Typography.Text strong>{role.label}</Typography.Text>
                <br />
                <Typography.Text type="secondary">{role.description}</Typography.Text>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
