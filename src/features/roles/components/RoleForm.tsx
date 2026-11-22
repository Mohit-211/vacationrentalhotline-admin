import { Form, Input } from "antd";
import { FormActions } from "@/components/FormActions";
import type { RoleFormValues } from "../types";

interface RoleFormProps {
  initialValues?: Partial<RoleFormValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: RoleFormValues) => void;
  onCancel: () => void;
}

export function RoleForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  return (
    <Form<RoleFormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={onSubmit}
      style={{ maxWidth: 560 }}
    >
      <Form.Item
        label="Role name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Enter the role name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Abbreviation"
        name="abbreviation"
        rules={[{ required: true, whitespace: true, message: "Enter an abbreviation" }]}
      >
        <Input />
      </Form.Item>
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
