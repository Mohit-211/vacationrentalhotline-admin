import { useMutation } from "@tanstack/react-query";
import { App, Card, Form, Input } from "antd";
import { useNavigate } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { getErrorMessage } from "@/utils/errors";
import { changePassword, type ChangePasswordValues } from "../api";

export function ChangePasswordPage() {
  const [form] = Form.useForm<ChangePasswordValues>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const changeMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (serverMessage) => {
      message.success(serverMessage || "Password changed");
      form.resetFields();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not change the password.")),
  });

  return (
    <>
      <PageHeader title="Change password" subtitle="Update the password you use to sign in" />
      <Card>
        <Form<ChangePasswordValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ maxWidth: 480 }}
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
            dependencies={["currentPassword"]}
            rules={[
              { required: true, message: "Enter a new password" },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
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
            rules={[
              { required: true, message: "Confirm the new password" },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  !value || value === getFieldValue("newPassword")
                    ? Promise.resolve()
                    : Promise.reject(new Error("The passwords do not match")),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <FormActions
            submitLabel="Change password"
            submitting={changeMutation.isPending}
            onCancel={() => navigate(-1)}
          />
        </Form>
      </Card>
    </>
  );
}
