import { useMutation } from "@tanstack/react-query";
import { App, Card, Form, Input } from "antd";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { useGoBack } from "@/routes/useGoBack";
import { getErrorCode, getErrorMessage } from "@/utils/errors";
import { changePassword } from "../api";
import { confirmPasswordRules, newPasswordRules } from "../passwordRules";
import type { ChangePasswordValues } from "../types";

export function ChangePasswordPage() {
  const [form] = Form.useForm<ChangePasswordValues>();
  const goBack = useGoBack(paths.profile);
  const { message } = App.useApp();
  const changeMutation = useMutation({
    mutationFn: (values: ChangePasswordValues) =>
      changePassword(values.currentPassword, values.newPassword),
    onSuccess: () => {
      message.success("Password changed. Your other devices were signed out.");
      form.resetFields();
    },
    onError: (error) => {
      const code = getErrorCode(error);
      if (code === "INVALID_PASSWORD") {
        form.setFields([{ name: "currentPassword", errors: ["That isn't your current password"] }]);
      } else if (code === "PASSWORD_TOO_WEAK") {
        form.setFields([
          { name: "newPassword", errors: [getErrorMessage(error, "Choose a stronger password")] },
        ]);
      } else {
        message.error(getErrorMessage(error, "Could not change the password."));
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Change password"
        subtitle="Changing it signs you out on your other devices"
      />
      <Card className="form-card">
        <Form<ChangePasswordValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => changeMutation.mutate(values)}
        >
          <Form.Item
            label="Current password"
            name="currentPassword"
            rules={[{ required: true, message: "Enter your current password" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            extra="At least 8 characters, with a letter and a number."
            dependencies={["currentPassword"]}
            rules={[
              ...newPasswordRules,
              ({ getFieldValue }) => ({
                validator: (_, value?: string) =>
                  !value || value !== getFieldValue("currentPassword")
                    ? Promise.resolve()
                    : Promise.reject(new Error("Choose a password different from the current one")),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={confirmPasswordRules("newPassword")}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <FormActions
            submitLabel="Change password"
            submitting={changeMutation.isPending}
            onCancel={goBack}
          />
        </Form>
      </Card>
    </>
  );
}
