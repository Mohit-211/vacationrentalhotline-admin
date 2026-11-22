import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { getImageChanges, toStoredUploadFile } from "@/utils/images";
import { fetchService, serviceKeys, updateService } from "../api";
import { ServiceForm } from "../components/ServiceForm";
import type { Service, ServiceFormValues } from "../types";

export function ServiceEditPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goBack = () => navigate(paths.service(serviceId));

  const serviceQuery = useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => fetchService(serviceId),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ images = [], ...input }: ServiceFormValues) => {
      const imageChanges = await getImageChanges(
        images,
        serviceQuery.data?.service_attachments ?? [],
      );
      await updateService(serviceId, input, imageChanges);
    },
    onSuccess: async () => {
      message.success("Service updated");
      await queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      goBack();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not update the service.")),
  });

  return (
    <>
      <PageHeader title="Edit service" onBack={goBack} />
      {serviceQuery.error ? (
        <QueryErrorResult error={serviceQuery.error} onRetry={() => serviceQuery.refetch()} />
      ) : (
        <Card loading={serviceQuery.isPending}>
          {serviceQuery.data && (
            <ServiceForm
              initialValues={toFormValues(serviceQuery.data)}
              submitLabel="Save changes"
              submitting={updateMutation.isPending}
              onSubmit={(values) => updateMutation.mutate(values)}
              onCancel={goBack}
            />
          )}
        </Card>
      )}
    </>
  );
}

function toFormValues(service: Service): Partial<ServiceFormValues> {
  return {
    name: service.name,
    abbreviation: service.abbreviation ?? "",
    price:
      service.price === null || service.price === undefined ? undefined : Number(service.price),
    description: service.description ?? "",
    images: (service.service_attachments ?? []).map(toStoredUploadFile),
  };
}
