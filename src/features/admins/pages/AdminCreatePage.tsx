import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage, getErrorStatus } from "@/utils/errors";
import { adminKeys, createAdmin } from "../api";
import { AdminForm } from "../components/AdminForm";

export function AdminCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.admins);

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: async () => {
      message.success("Admin added");
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
      goToList();
    },
    onError: (error) =>
      message.error(
        getErrorMessage(
          error,
          getErrorStatus(error) === 400
            ? "An admin with this email already exists."
            : "Could not add the admin.",
        ),
      ),
  });

  return (
    <>
      <PageHeader
        title="Add admin"
        subtitle="Give someone access to this panel"
        onBack={goToList}
      />
      <Card className="form-card">
        <AdminForm
          submitLabel="Add admin"
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={goToList}
        />
      </Card>
    </>
  );
}
