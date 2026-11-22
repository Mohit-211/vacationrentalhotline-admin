import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Empty, Flex, Image } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SafeHtml } from "@/components/SafeHtml";
import { paths } from "@/routes/paths";
import { displayValue, formatCurrency } from "@/utils/format";
import { assetUrl } from "@/utils/images";
import { fetchService, serviceKeys } from "../api";

export function ServiceDetailsPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => fetchService(serviceId),
  });
  const service = serviceQuery.data;
  const images = service?.service_attachments ?? [];

  return (
    <>
      <PageHeader
        title={service?.name ?? "Service"}
        onBack={() => navigate(paths.services)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => navigate(paths.editService(serviceId))}>
            Edit
          </Button>
        }
      />
      {serviceQuery.error ? (
        <QueryErrorResult error={serviceQuery.error} onRetry={() => serviceQuery.refetch()} />
      ) : (
        <Flex vertical gap="large">
          <Card title="Details" loading={serviceQuery.isPending}>
            <Descriptions
              column={{ xs: 1, md: 3 }}
              items={[
                { key: "name", label: "Name", children: displayValue(service?.name) },
                {
                  key: "abbreviation",
                  label: "Abbreviation",
                  children: displayValue(service?.abbreviation),
                },
                { key: "price", label: "Price", children: formatCurrency(service?.price) },
              ]}
            />
          </Card>
          <Card title="Images" loading={serviceQuery.isPending}>
            {images.length ? (
              <Image.PreviewGroup>
                <Flex wrap gap="middle">
                  {images.map((image, index) => (
                    <Image
                      key={image.id}
                      src={assetUrl(image.file_name)}
                      alt={`${service?.name ?? "Service"} image ${index + 1}`}
                      width={150}
                      height={150}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  ))}
                </Flex>
              </Image.PreviewGroup>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images" />
            )}
          </Card>
          <Card title="Description" loading={serviceQuery.isPending}>
            <SafeHtml html={service?.description} />
          </Card>
        </Flex>
      )}
    </>
  );
}
