import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { customerKeys } from "@/features/customers/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { fetchProperty, propertyKeys, updateProperty } from "../api";
import { PropertyForm } from "../components/PropertyForm";
import { toPropertyBody } from "../propertyBody";
import type { PropertyValues } from "../types";

export function PropertyEditPage() {
  const { propertyId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<PropertyValues>();
  const goToProperty = () => navigate(paths.property(propertyId));
  const propertyQuery = useQuery({
    queryKey: propertyKeys.detail(propertyId),
    queryFn: () => fetchProperty(propertyId),
  });
  const property = propertyQuery.data;

  const updateMutation = useMutation({
    mutationFn: (values: PropertyValues) => updateProperty(propertyId, toPropertyBody(values)),
    onSuccess: async () => {
      message.success("Property saved");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
      ]);
      goToProperty();
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not save the property."));
      }
    },
  });

  return (
    <>
      <PageHeader title="Edit property" subtitle={property?.fullAddress} onBack={goToProperty} />
      {propertyQuery.error ? (
        <Card>
          <QueryErrorResult
            error={propertyQuery.error}
            onRetry={() => propertyQuery.refetch()}
            notFoundText="This property doesn't exist or was deleted."
          />
        </Card>
      ) : (
        <Card className="form-card" loading={propertyQuery.isPending}>
          {property && (
            <PropertyForm
              form={form}
              initialValues={{
                ownerName: property.ownerName,
                ownerEmail: property.ownerEmail,
                ownerAltEmail: property.ownerAltEmail,
                ownerPhone: property.ownerPhone,
                ownerAltPhone: property.ownerAltPhone,
                addressLine1: property.addressLine1,
                addressLine2: property.addressLine2,
                city: property.city,
                countryCode: property.countryCode,
                regionCode: property.regionCode,
                postalCode: property.postalCode,
              }}
              submitLabel="Save changes"
              submitting={updateMutation.isPending}
              onSubmit={(values) => updateMutation.mutate(values)}
              onCancel={goToProperty}
            />
          )}
        </Card>
      )}
    </>
  );
}
