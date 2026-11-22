import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { createCustomer, customerKeys } from "../api";
import type { Customer, NewCustomerValues } from "../types";

export function CustomerCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<NewCustomerValues>();
  const [created, setCreated] = useState<{
    customer: Customer;
    password: string;
    emailed: boolean;
  }>();

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: async (result, values) => {
      setCreated({ ...result, emailed: values.sendEmail });
      await queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not add the customer."));
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Add customer"
        subtitle="Create a site account for someone; they can sign in right away"
        onBack={() => navigate(paths.customers)}
      />
      <Card className="form-card">
        <Form<NewCustomerValues>
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ sendEmail: true }}
          onFinish={(values) => createMutation.mutate(values)}
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, whitespace: true, message: "Enter the customer's name" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input type="email" autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            extra="Include the country code, such as +1 512 555 0111."
          >
            <Input type="tel" autoComplete="off" />
          </Form.Item>
          <Form.Item name="sendEmail" valuePropName="checked">
            <Checkbox>Email them their password</Checkbox>
          </Form.Item>
          <FormActions
            submitLabel="Add customer"
            submitting={createMutation.isPending}
            onCancel={() => navigate(paths.customers)}
          />
        </Form>
      </Card>
      <PasswordDialog
        password={created?.password ?? null}
        accountName={created?.customer.name ?? ""}
        emailed={created?.emailed ?? false}
        onClose={() => created && navigate(paths.customer(created.customer.id), { replace: true })}
      />
    </>
  );
}
