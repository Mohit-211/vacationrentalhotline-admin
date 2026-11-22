import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form, Result } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { meQueryKey } from "@/features/auth/api";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchRoles, roleKeys } from "@/features/roles/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { fetchStaff, staffKeys, updateStaff } from "../api";
import { StaffForm } from "../components/StaffForm";
import type { NewStaffValues } from "../types";

export function StaffEditPage() {
  const { staffId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { me } = useAuth();
  const [form] = Form.useForm<NewStaffValues>();
  const goToList = () => navigate(paths.staff);
  // There is no endpoint for one staff member, so they come from the list.
  const staffQuery = useQuery({ queryKey: staffKeys.all, queryFn: fetchStaff });
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });
  const member = staffQuery.data?.find((item) => item.id === staffId);
  const isSelf = member?.id === me?.id;

  const updateMutation = useMutation({
    mutationFn: (values: NewStaffValues) =>
      updateStaff(staffId, {
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
      }),
    onSuccess: async () => {
      message.success("Staff member saved");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all }),
        queryClient.invalidateQueries({ queryKey: roleKeys.all }),
        // Editing yourself changes the name in the header.
        isSelf ? queryClient.invalidateQueries({ queryKey: meQueryKey }) : undefined,
      ]);
      goToList();
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not save the staff member."));
      }
    },
  });

  const error = staffQuery.error ?? rolesQuery.error;
  const loading = staffQuery.isPending || rolesQuery.isPending;

  return (
    <>
      <PageHeader title="Edit staff member" subtitle={member?.name} onBack={goToList} />
      {error ? (
        <Card>
          <QueryErrorResult
            error={error}
            onRetry={() => {
              void staffQuery.refetch();
              void rolesQuery.refetch();
            }}
          />
        </Card>
      ) : (
        <Card className="form-card" loading={loading}>
          {!loading &&
            (member && rolesQuery.data ? (
              <StaffForm
                form={form}
                roles={rolesQuery.data}
                isNew={false}
                isSelf={isSelf}
                initialValues={{ name: member.name, email: member.email, role: member.role }}
                submitLabel="Save changes"
                submitting={updateMutation.isPending}
                onSubmit={(values) => updateMutation.mutate(values)}
                onCancel={goToList}
              />
            ) : (
              <Result
                status="404"
                title="Not found"
                subTitle="This staff member doesn't exist or was removed."
              />
            ))}
        </Card>
      )}
    </>
  );
}
