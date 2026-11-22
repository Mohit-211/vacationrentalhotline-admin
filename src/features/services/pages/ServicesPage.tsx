import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Space, Table, Tooltip, type TableProps } from "antd";
import { useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { displayValue, formatCurrency } from "@/utils/format";
import { deleteService, fetchServices, serviceKeys } from "../api";
import type { Service } from "../types";

export function ServicesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const servicesQuery = useQuery({ queryKey: serviceKeys.all, queryFn: fetchServices });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: (serverMessage) => {
      message.success(serverMessage || "Service deleted");
      return queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the service.")),
  });

  const columns: TableProps<Service>["columns"] = [
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Abbreviation", dataIndex: "abbreviation", render: displayValue },
    { title: "Price", dataIndex: "price", align: "right", render: formatCurrency },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, service) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              aria-label={`View ${service.name}`}
              onClick={() => navigate(paths.service(service.id))}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              aria-label={`Edit ${service.name}`}
              onClick={() => navigate(paths.editService(service.id))}
            />
          </Tooltip>
          <DeleteButton
            itemName={service.name}
            loading={deleteMutation.isPending && deleteMutation.variables === service.id}
            onConfirm={() => deleteMutation.mutate(service.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Services offered in the app"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newService)}>
            Add service
          </Button>
        }
      />
      {servicesQuery.error ? (
        <QueryErrorResult error={servicesQuery.error} onRetry={() => servicesQuery.refetch()} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={servicesQuery.data}
          loading={servicesQuery.isPending}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
}
