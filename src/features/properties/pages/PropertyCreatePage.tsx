import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { addProperties, customerKeys, fetchCustomer } from "@/features/customers/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { propertyKeys } from "../api";
import { PropertyForm } from "../components/PropertyForm";
import { toPropertyBody } from "../propertyBody";
import type { PropertyValues } from "../types";

/** Adds a property to a customer's account. */
export function PropertyCreatePage() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<PropertyValues>();
  const goToCustomer = () => navigate(paths.customer(customerId));
  const customerQuery = useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => fetchCustomer(customerId),
  });
  const customer = customerQuery.data;

  const createMutation = useMutation({
    mutationFn: (values: PropertyValues) => addProperties(customerId, [toPropertyBody(values)]),
    onSuccess: async ([property]) => {
      message.success("Property added");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
        queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
      ]);
      navigate(property ? paths.property(property.id) : paths.customer(customerId), {
        replace: true,
      });
    },
    onError: (error) => {
      // The API takes a list of properties; this form sends one, so its errors start "properties.0".
      if (!showFieldErrors(form, error, "properties.0")) {
        message.error(getErrorMessage(error, "Could not add the property."));
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Add property"
        subtitle={customer ? `For ${customer.name}` : undefined}
        onBack={goToCustomer}
      />
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
            <PropertyForm
              form={form}
              // The owner is usually the customer; staff can change it.
              initialValues={{
                ownerName: customer.name,
                ownerEmail: customer.email,
                ownerPhone: customer.phone ?? undefined,
              }}
              submitLabel="Add property"
              submitting={createMutation.isPending}
              onSubmit={(values) => createMutation.mutate(values)}
              onCancel={goToCustomer}
            />
          )}
        </Card>
      )}
    </>
  );
}
