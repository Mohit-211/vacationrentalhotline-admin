import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form, Result } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { fetchRoles, roleKeys, updateRole } from "../api";
import { RoleForm } from "../components/RoleForm";
import type { RoleValues } from "../types";

export function RoleEditPage() {
  const { roleName = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<RoleValues>();
  const goToList = () => navigate(paths.roles);
  // There is no endpoint for one role, so it comes from the list.
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });
  const role = rolesQuery.data?.find((item) => item.name === roleName);

  const updateMutation = useMutation({
    mutationFn: (values: RoleValues) =>
      updateRole(roleName, { label: values.label.trim(), permissions: values.permissions }),
    onSuccess: async () => {
      message.success("Role saved. Its staff get the change on their next click.");
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      goToList();
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not save the role."));
      }
    },
  });

  return (
    <>
      <PageHeader title="Edit role" subtitle={role?.label} onBack={goToList} />
      {rolesQuery.error ? (
        <Card>
          <QueryErrorResult error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
        </Card>
      ) : (
        <Card className="form-card" loading={rolesQuery.isPending}>
          {rolesQuery.data &&
            (!role ? (
              <Result status="404" title="Not found" subTitle="This role doesn't exist." />
            ) : !role.editable ? (
              <Result
                status="info"
                title="This role can't be changed"
                subTitle="Admin always has every permission."
              />
            ) : (
              <RoleForm
                form={form}
                isNew={false}
                initialValues={{ label: role.label, permissions: role.permissions }}
                submitLabel="Save changes"
                submitting={updateMutation.isPending}
                onSubmit={(values) => updateMutation.mutate(values)}
                onCancel={goToList}
              />
            ))}
        </Card>
      )}
    </>
  );
}
