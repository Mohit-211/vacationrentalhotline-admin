import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Divider, Form, Input } from "antd";
import { useNavigate, useParams } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { AddressPlaceFields } from "@/features/locations/AddressPlaceFields";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { customerKeys, fetchCustomer, updateCustomer } from "../api";
import type { CustomerValues } from "../types";

/** Empty optional fields go to the API as null, which clears them. */
function toCustomerBody(values: CustomerValues): CustomerValues {
  const optional = (value: string | null | undefined) => (value?.trim() ? value.trim() : null);
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: optional(values.phone),
    streetAddress: optional(values.streetAddress),
    city: optional(values.city),
    countryCode: values.countryCode ?? null,
    regionCode: values.regionCode ?? null,
    postalCode: optional(values.postalCode),
  };
}

export function CustomerEditPage() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<CustomerValues>();
  const goToCustomer = () => navigate(paths.customer(customerId));
  const customerQuery = useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => fetchCustomer(customerId),
  });
  const customer = customerQuery.data;

  const updateMutation = useMutation({
    mutationFn: (values: CustomerValues) => updateCustomer(customerId, toCustomerBody(values)),
    onSuccess: async () => {
      message.success("Customer saved");
      await queryClient.invalidateQueries({ queryKey: customerKeys.all });
      goToCustomer();
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not save the customer."));
      }
    },
  });

  return (
    <>
      <PageHeader title="Edit customer" subtitle={customer?.name} onBack={goToCustomer} />
      {customerQuery.error ? (
        <Card>
          <QueryErrorResult
            error={customerQuery.error}
            onRetry={() => customerQuery.refetch()}
            notFoundText="This customer doesn't exist or was deleted."
          />
        </Card>
      ) : (
        <Card className="form-card" loading={customerQuery.isPending}>
          {customer && (
            <Form<CustomerValues>
              form={form}
              layout="vertical"
              requiredMark="optional"
              initialValues={{
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                streetAddress: customer.streetAddress,
                city: customer.city,
                countryCode: customer.countryCode ?? undefined,
                regionCode: customer.regionCode ?? undefined,
                postalCode: customer.postalCode,
              }}
              onFinish={(values) => updateMutation.mutate(values)}
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
                extra="Changes straight away, without a confirmation email."
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
              <Divider titlePlacement="start" plain>
                Address
              </Divider>
              <Form.Item label="Street address" name="streetAddress">
                <Input autoComplete="off" />
              </Form.Item>
              <AddressPlaceFields required={false} />
              <FormActions
                submitLabel="Save changes"
                submitting={updateMutation.isPending}
                onCancel={goToCustomer}
              />
            </Form>
          )}
        </Card>
      )}
    </>
  );
}
