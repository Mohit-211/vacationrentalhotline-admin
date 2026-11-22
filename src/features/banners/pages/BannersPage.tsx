import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Image, Space, Table, Tooltip, type TableProps } from "antd";
import { useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { assetUrl } from "@/utils/images";
import { bannerKeys, deleteBanner, fetchBanners } from "../api";
import type { Banner } from "../types";

export function BannersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const bannersQuery = useQuery({ queryKey: bannerKeys.all, queryFn: fetchBanners });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: (serverMessage) => {
      message.success(serverMessage || "Banner deleted");
      return queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the banner.")),
  });

  const columns: TableProps<Banner>["columns"] = [
    {
      title: "Image",
      dataIndex: "file_name",
      render: (fileName: string) => (
        <Image src={assetUrl(fileName)} alt="Banner" width={160} style={{ borderRadius: 6 }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, banner) => (
        <Space>
          <Tooltip title="Replace image">
            <Button
              icon={<EditOutlined />}
              aria-label="Replace banner image"
              onClick={() => navigate(paths.editBanner(banner.id))}
            />
          </Tooltip>
          <DeleteButton
            itemName="this banner"
            loading={deleteMutation.isPending && deleteMutation.variables === banner.id}
            onConfirm={() => deleteMutation.mutate(banner.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Banners"
        subtitle="Images shown on the home screen of the app"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newBanner)}>
            Add banners
          </Button>
        }
      />
      {bannersQuery.error ? (
        <QueryErrorResult error={bannersQuery.error} onRetry={() => bannersQuery.refetch()} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={bannersQuery.data}
          loading={bannersQuery.isPending}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
        />
      )}
    </>
  );
}
