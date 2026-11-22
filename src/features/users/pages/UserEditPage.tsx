import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form, Input, Select } from "antd";
import { useNavigate, useParams } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { fetchUser, updateUser, userKeys } from "../api";
import { SUBSCRIPTION_STATUS_OPTIONS, type UserEditValues } from "../types";

export function UserEditPage() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToUser = () => navigate(paths.user(userId));

  const userQuery = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });
  const updateMutation = useMutation({
    mutationFn: (values: UserEditValues) => updateUser(userId, values),
    onSuccess: async () => {
      message.success("User updated");
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      goToUser();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not update the user.")),
  });
  const user = userQuery.data;

  return (
    <>
      <PageHeader title="Edit user" subtitle="Update a user's details" onBack={goToUser} />
      {userQuery.error ? (
        <QueryErrorResult error={userQuery.error} onRetry={() => userQuery.refetch()} />
      ) : (
        <Card loading={userQuery.isPending}>
          {user && (
            <Form<UserEditValues>
              layout="vertical"
              requiredMark={false}
              style={{ maxWidth: 560 }}
              initialValues={{
                name: user.user_profile?.name ?? "",
                email: user.email,
                subscriptionStatus: user.subscription_status ?? undefined,
              }}
              onFinish={(values) => updateMutation.mutate(values)}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, whitespace: true, message: "Enter the user's name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter an email address" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Subscription status" name="subscriptionStatus">
                <Select
                  allowClear
                  placeholder="Not set"
                  options={SUBSCRIPTION_STATUS_OPTIONS.map((option) => ({ ...option }))}
                />
              </Form.Item>
              <FormActions submitting={updateMutation.isPending} onCancel={goToUser} />
            </Form>
          )}
        </Card>
      )}
    </>
  );
}
