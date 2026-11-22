import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Flex, Form, InputNumber, Modal, Popconfirm, Typography } from "antd";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { propertyKeys } from "@/features/properties/api";
import { getErrorMessage } from "@/utils/errors";
import { formatNumber } from "@/utils/format";
import { customerKeys, removeFreeCover, setFreeCover } from "../api";
import type { CustomerDetails } from "../types";

/** Free cover: the customer's properties covered at no charge, up to a number staff choose. */
export function FreeCoverCard({ customer }: { customer: CustomerDetails }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<{ properties: number }>();
  const [open, setOpen] = useState(false);
  const limit = customer.freeCover?.properties;

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: customerKeys.all }),
      queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
    ]);

  const setMutation = useMutation({
    mutationFn: (properties: number) => setFreeCover(customer.id, properties),
    onSuccess: async () => {
      setOpen(false);
      message.success("Free cover saved");
      await refresh();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not save free cover.")),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFreeCover(customer.id),
    onSuccess: async ({ uncovered }) => {
      message.success(
        uncovered > 0
          ? `Free cover turned off. ${formatNumber(uncovered)} ${uncovered === 1 ? "property" : "properties"} lost cover.`
          : "Free cover turned off",
      );
      await refresh();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not turn free cover off.")),
  });

  const openEditor = () => setOpen(true);

  return (
    <Card
      title="Free cover"
      extra={
        can("billing.manage") && (
          <Flex gap="small">
            {limit ? (
              <>
                <Button onClick={openEditor}>Change limit</Button>
                <Popconfirm
                  title="Turn off free cover?"
                  description={
                    <div className="confirm-text">
                      Properties no payment covers lose cover at once, and the customer is emailed.
                    </div>
                  }
                  okText="Turn off"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => removeMutation.mutate()}
                >
                  <Button danger loading={removeMutation.isPending}>
                    Turn off
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <Button onClick={openEditor}>Turn on</Button>
            )}
          </Flex>
        )
      }
    >
      <Typography.Text>
        {limit
          ? `On: covers up to ${formatNumber(limit)} ${limit === 1 ? "property" : "properties"} at no charge, including ones added later.`
          : "Off. With free cover on, this customer's properties are covered at no charge."}
      </Typography.Text>
      <Modal
        open={open}
        title={limit ? "Change the free cover limit" : "Turn on free cover"}
        okText="Save"
        confirmLoading={setMutation.isPending}
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <Typography.Paragraph>
          Every property this customer has is covered at no charge, up to this number. They can't
          add more than that. A paid subscription they already have keeps renewing: cancel its
          renewal if they shouldn't pay any more.
        </Typography.Paragraph>
        <Form<{ properties: number }>
          form={form}
          layout="vertical"
          requiredMark={false}
          // Starts at the current limit, or at the number of properties they have.
          initialValues={{ properties: limit ?? Math.max(1, customer.properties.length) }}
          onFinish={(values) => setMutation.mutate(values.properties)}
        >
          <Form.Item
            label="Properties covered"
            name="properties"
            rules={[{ required: true, message: "Enter how many properties to cover" }]}
          >
            <InputNumber min={1} max={1000} precision={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
