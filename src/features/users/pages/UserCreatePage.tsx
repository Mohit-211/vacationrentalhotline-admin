import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form, Input } from "antd";
import { useNavigate } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage, getErrorStatus } from "@/utils/errors";
import { createUser, userKeys } from "../api";
import type { NewUserValues } from "../types";

export function UserCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.users);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      message.success("User added");
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      goToList();
    },
    onError: (error) =>
      message.error(
        getErrorMessage(
          error,
          getErrorStatus(error) === 400
            ? "A user with this email already exists."
            : "Could not add the user.",
        ),
      ),
  });

  return (
    <>
      <PageHeader title="Add user" subtitle="Create an app account for someone" onBack={goToList} />
      <Card>
        <Form<NewUserValues>
          layout="vertical"
          requiredMark={false}
          style={{ maxWidth: 560 }}
          onFinish={(values) => createMutation.mutate(values)}
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, whitespace: true, message: "Enter the user's name" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input type="email" autoComplete="off" />
          </Form.Item>
          <FormActions
            submitLabel="Add user"
            submitting={createMutation.isPending}
            onCancel={goToList}
          />
        </Form>
      </Card>
    </>
  );
}
