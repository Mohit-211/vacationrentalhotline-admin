import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { getImageChanges } from "@/utils/images";
import { createService, serviceKeys } from "../api";
import { ServiceForm } from "../components/ServiceForm";
import type { ServiceFormValues } from "../types";

export function ServiceCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.services);

  const createMutation = useMutation({
    mutationFn: async ({ images = [], ...input }: ServiceFormValues) => {
      const { newFiles } = await getImageChanges(images);
      await createService(input, newFiles);
    },
    onSuccess: async () => {
      message.success("Service added");
      await queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      goToList();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not add the service.")),
  });

  return (
    <>
      <PageHeader title="Add service" onBack={goToList} />
      <Card>
        <ServiceForm
          submitLabel="Add service"
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={goToList}
        />
      </Card>
    </>
  );
}
