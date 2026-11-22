import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { fetchRoles, roleKeys } from "@/features/roles/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { createStaff, staffKeys } from "../api";
import { StaffForm } from "../components/StaffForm";
import type { NewStaffValues } from "../types";

export function StaffCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<NewStaffValues>();
  const goToList = () => navigate(paths.staff);
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });
  const [created, setCreated] = useState<{ name: string; password: string; emailed: boolean }>();

  const createMutation = useMutation({
    mutationFn: (values: NewStaffValues) =>
      createStaff({ ...values, name: values.name.trim(), email: values.email.trim() }),
    onSuccess: async (result, values) => {
      setCreated({ name: result.staff.name, password: result.password, emailed: values.sendEmail });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all }),
        queryClient.invalidateQueries({ queryKey: roleKeys.all }),
      ]);
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not add the staff member."));
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Add staff member"
        subtitle="Give someone access to this panel"
        onBack={goToList}
      />
      {rolesQuery.error ? (
        <Card>
          <QueryErrorResult error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
        </Card>
      ) : (
        <Card className="form-card" loading={rolesQuery.isPending}>
          {rolesQuery.data && (
            <StaffForm
              form={form}
              roles={rolesQuery.data}
              isNew
              submitLabel="Add staff member"
              submitting={createMutation.isPending}
              onSubmit={(values) => createMutation.mutate(values)}
              onCancel={goToList}
            />
          )}
        </Card>
      )}
      <PasswordDialog
        password={created?.password ?? null}
        accountName={created?.name ?? ""}
        emailed={created?.emailed ?? false}
        onClose={() => navigate(paths.staff, { replace: true })}
      />
    </>
  );
}
