import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { fetchRole, roleKeys, updateRole } from "../api";
import { RoleForm } from "../components/RoleForm";
import type { RoleFormValues } from "../types";

export function RoleEditPage() {
  const { roleId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.roles);

  const roleQuery = useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: () => fetchRole(roleId),
  });
  const updateMutation = useMutation({
    mutationFn: (values: RoleFormValues) => updateRole(roleId, values),
    onSuccess: async () => {
      message.success("Role updated");
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      goToList();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not update the role.")),
  });

  return (
    <>
      <PageHeader title="Edit role" onBack={goToList} />
      {roleQuery.error ? (
        <QueryErrorResult error={roleQuery.error} onRetry={() => roleQuery.refetch()} />
      ) : (
        <Card loading={roleQuery.isPending}>
          {roleQuery.data && (
            <RoleForm
              initialValues={{
                name: roleQuery.data.name,
                abbreviation: roleQuery.data.abbreviation ?? "",
              }}
              submitLabel="Save changes"
              submitting={updateMutation.isPending}
              onSubmit={(values) => updateMutation.mutate(values)}
              onCancel={goToList}
            />
          )}
        </Card>
      )}
    </>
  );
}
