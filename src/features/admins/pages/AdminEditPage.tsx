import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { profileQueryKey } from "@/features/auth/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { adminKeys, fetchAdmin, updateAdmin } from "../api";
import { AdminForm } from "../components/AdminForm";
import { ADMIN_ROLE_OPTIONS, type Admin, type AdminFormValues, type AdminRoleId } from "../types";

export function AdminEditPage() {
  const { adminId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.admins);

  const adminQuery = useQuery({
    queryKey: adminKeys.detail(adminId),
    queryFn: () => fetchAdmin(adminId),
  });

  const updateMutation = useMutation({
    mutationFn: (values: AdminFormValues) => updateAdmin(adminId, values),
    onSuccess: async () => {
      message.success("Admin updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.all }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
      ]);
      goToList();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not update the admin.")),
  });

  return (
    <>
      <PageHeader
        title="Edit admin"
        subtitle="Change an admin's details or role"
        onBack={goToList}
      />
      {adminQuery.error ? (
        <QueryErrorResult error={adminQuery.error} onRetry={() => adminQuery.refetch()} />
      ) : (
        <Card loading={adminQuery.isPending}>
          {adminQuery.data && (
            <AdminForm
              initialValues={toFormValues(adminQuery.data)}
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

/** The API may return the role as an id or only as a name; map either to a known role id. */
function toFormValues(admin: Admin): Partial<AdminFormValues> {
  const byId = ADMIN_ROLE_OPTIONS.find((role) => role.id === Number(admin.role_id));
  const byName = ADMIN_ROLE_OPTIONS.find(
    (role) => role.label.toLowerCase() === admin.admin_role?.name?.toLowerCase(),
  );
  const roleId: AdminRoleId | undefined = (byId ?? byName)?.id;
  return { name: admin.name, email: admin.email, roleId };
}
