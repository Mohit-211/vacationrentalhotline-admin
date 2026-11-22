import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { createRole, roleKeys } from "../api";
import { RoleForm } from "../components/RoleForm";

export function RoleCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.roles);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: async () => {
      message.success("Role added");
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      goToList();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not add the role.")),
  });

  return (
    <>
      <PageHeader title="Add role" onBack={goToList} />
      <Card>
        <RoleForm
          submitLabel="Add role"
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={goToList}
        />
      </Card>
    </>
  );
}
