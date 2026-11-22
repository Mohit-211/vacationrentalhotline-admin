import { Checkbox, Flex, Form, Input, type FormInstance } from "antd";
import { FormActions } from "@/components/FormActions";
import { PERMISSION_LABELS, PERMISSIONS } from "@/features/auth/permissions";
import type { RoleValues } from "../types";

interface RoleFormProps {
  form: FormInstance<RoleValues>;
  /** A role's name can't change once created. */
  isNew: boolean;
  initialValues?: Partial<RoleValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: RoleValues) => void;
  onCancel: () => void;
}

/** "Support Team" -> "support-team": a valid role name to start from. */
function toRoleName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^[^a-z]+/, "")
    .replace(/-+$/, "")
    .slice(0, 20);
}

export function RoleForm({
  form,
  isNew,
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  return (
    <Form<RoleValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ permissions: [], ...initialValues }}
      onFinish={onSubmit}
      onValuesChange={(changed: Partial<RoleValues>) => {
        // Suggest a name from the label until someone types their own.
        if (isNew && changed.label !== undefined && !form.isFieldTouched("name")) {
          form.setFieldValue("name", toRoleName(changed.label));
        }
      }}
    >
      <Form.Item
        label="Role name"
        name="label"
        rules={[
          { required: true, whitespace: true, message: "Enter a name for the role" },
          { max: 60, message: "Use at most 60 characters" },
        ]}
      >
        <Input autoComplete="off" placeholder="Support" />
      </Form.Item>
      {isNew && (
        <Form.Item
          label="Short code"
          name="name"
          extra="Used by the system. 2-20 lower-case letters, digits or hyphens, starting with a letter. It can't be changed later."
          rules={[
            { required: true, message: "Enter a short code" },
            {
              pattern: /^[a-z][a-z0-9-]{1,19}$/,
              message: "Use 2-20 lower-case letters, digits or hyphens, starting with a letter",
            },
          ]}
        >
          <Input autoComplete="off" placeholder="support" />
        </Form.Item>
      )}
      <Form.Item label="What it allows" name="permissions">
        <Checkbox.Group>
          <Flex vertical gap="small">
            {PERMISSIONS.map((permission) => (
              <Checkbox key={permission} value={permission}>
                {PERMISSION_LABELS[permission]}
              </Checkbox>
            ))}
          </Flex>
        </Checkbox.Group>
      </Form.Item>
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
