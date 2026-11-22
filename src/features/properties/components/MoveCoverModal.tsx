import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, App, Form, Modal, Select, Spin, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { customerKeys } from "@/features/customers/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { formatDate, formatNumber } from "@/utils/format";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { fetchProperties, moveCover, propertyKeys } from "../api";
import type { PropertyDetails, PropertyListParams } from "../types";

/** How many of the customer's properties without cover are offered at once; typing searches all. */
const CHOICES = 50;

interface MoveCoverValues {
  /** The chosen property with its address, which stays shown while a search hides the option. */
  target: { value: string; label: string };
}

interface MoveCoverModalProps {
  property: PropertyDetails;
  open: boolean;
  onClose: () => void;
}

/**
 * Moves a property's paid cover to another of the customer's properties that has none, for an
 * owner who sold this one. The API then deletes this property with its notes; its payments stay
 * on record, and nothing is charged or refunded.
 */
export function MoveCoverModal({ property, open, onClose }: MoveCoverModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { can } = useAuth();
  const [form] = Form.useForm<MoveCoverValues>();
  const [search, setSearch] = useState("");
  const searchText = useDebouncedValue(search.trim());
  const { customer } = property;

  // Cover can only move to the same customer's properties that have none.
  const params: PropertyListParams = {
    customerId: customer.id,
    status: "inactive",
    search: searchText || undefined,
    page: 1,
    pageSize: CHOICES,
  };
  const choicesQuery = useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: () => fetchProperties(params),
    enabled: open,
    placeholderData: keepPreviousData,
  });
  const choices = choicesQuery.data?.data ?? [];
  const total = choicesQuery.data?.meta.total ?? 0;
  const noChoices = !searchText && choicesQuery.isSuccess && total === 0;

  const close = () => {
    setSearch("");
    onClose();
  };

  const moveMutation = useMutation({
    mutationFn: (toPropertyId: string) => moveCover(property.id, toPropertyId),
    onSuccess: async (moved) => {
      close();
      message.success(`Cover moved to ${moved.fullAddress}. The old property was deleted.`);
      // This property no longer exists: open the one now covered in its place.
      queryClient.setQueryData(propertyKeys.detail(moved.id), moved);
      navigate(paths.property(moved.id), { replace: true });
      queryClient.removeQueries({ queryKey: propertyKeys.detail(property.id) });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
      ]);
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not move the cover.")),
  });

  return (
    <Modal
      open={open}
      title="Move cover to another property"
      okText="Move cover"
      okButtonProps={{ danger: true }}
      cancelText={noChoices ? "Close" : "Cancel"}
      confirmLoading={moveMutation.isPending}
      onOk={() => form.submit()}
      onCancel={close}
      footer={noChoices ? (_, { CancelBtn }) => <CancelBtn /> : undefined}
      destroyOnHidden
    >
      <Typography.Paragraph>
        The paid cover moves to the property you choose, with the same end date (
        {formatDate(property.subscriptionEndsAt)}){property.autoRenews && " and automatic renewal"}.
        Nothing is charged or refunded.
      </Typography.Paragraph>
      {noChoices ? (
        <Alert
          type="info"
          showIcon
          title={`${customer.name} has no other property without cover`}
          description="Add the property the cover should move to, then move it from here."
          action={
            can("customers.manage") && (
              <Link to={paths.newCustomerProperty(customer.id)}>Add a property</Link>
            )
          }
        />
      ) : (
        <>
          <Form<MoveCoverValues>
            form={form}
            name="move-cover"
            layout="vertical"
            requiredMark={false}
            // Forgets the choice when the dialog closes, so it opens empty next time.
            preserve={false}
            onFinish={(values) => moveMutation.mutate(values.target.value)}
          >
            <Form.Item
              label="Move the cover to"
              name="target"
              rules={[{ required: true, message: "Choose the property to move the cover to" }]}
              extra={
                total > choices.length
                  ? `Their properties without cover: ${formatNumber(choices.length)} of ${formatNumber(total)} shown. Type part of the address to find the others.`
                  : "Their properties without cover."
              }
            >
              <Select
                labelInValue
                placeholder="Choose a property"
                showSearch={{ filterOption: false, onSearch: setSearch }}
                // A search only narrows the list while it is open.
                onOpenChange={(isOpen) => {
                  if (!isOpen) setSearch("");
                }}
                loading={choicesQuery.isFetching}
                notFoundContent={
                  choicesQuery.isFetching ? (
                    <Spin size="small" />
                  ) : (
                    "None of their properties without cover matches"
                  )
                }
                options={choices.map((choice) => ({ value: choice.id, label: choice.fullAddress }))}
              />
            </Form.Item>
          </Form>
          <Alert
            type="warning"
            showIcon
            title="This property is then deleted, with its notes. Its payments stay on record."
          />
        </>
      )}
    </Modal>
  );
}
