import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { createRole, roleKeys } from "../api";
import { RoleForm } from "../components/RoleForm";
import type { RoleValues } from "../types";

export function RoleCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<RoleValues>();
  const goToList = () => navigate(paths.roles);

  const createMutation = useMutation({
    mutationFn: (values: RoleValues) =>
      createRole({ ...values, label: values.label.trim(), name: values.name.trim() }),
    onSuccess: async () => {
      message.success("Role added");
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      goToList();
    },
    onError: (error) => {
      if (!showFieldErrors(form, error)) {
        message.error(getErrorMessage(error, "Could not add the role."));
      }
    },
  });

  return (
    <>
      <PageHeader
        title="Add role"
        subtitle="A role is a set of things staff can do; give it to staff on the Staff page"
        onBack={goToList}
      />
      <Card className="form-card">
        <RoleForm
          form={form}
          isNew
          submitLabel="Add role"
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={goToList}
        />
      </Card>
    </>
  );
}
