import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Empty, Flex, Form, Image, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { FormActions } from "@/components/FormActions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { assetUrl, getImageChanges } from "@/utils/images";
import { bannerKeys, fetchBanner, replaceBannerImage } from "../api";
import type { BannerFormValues } from "../types";

export function BannerEditPage() {
  const { bannerId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<BannerFormValues>();
  const selectedImages = Form.useWatch("images", form) ?? [];
  const goToList = () => navigate(paths.banners);

  const bannerQuery = useQuery({
    queryKey: bannerKeys.detail(bannerId),
    queryFn: () => fetchBanner(bannerId),
  });
  const banner = bannerQuery.data;

  const replaceMutation = useMutation({
    mutationFn: async ({ images }: BannerFormValues) => {
      const { newFiles } = await getImageChanges(images);
      if (!banner || !newFiles[0]) return;
      await replaceBannerImage(bannerId, newFiles[0], banner.id);
    },
    onSuccess: async () => {
      message.success("Banner image replaced");
      await queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      goToList();
    },
    onError: (error) =>
      message.error(getErrorMessage(error, "Could not replace the banner image.")),
  });

  return (
    <>
      <PageHeader title="Replace banner image" onBack={goToList} />
      {bannerQuery.error ? (
        <QueryErrorResult error={bannerQuery.error} onRetry={() => bannerQuery.refetch()} />
      ) : (
        <Card loading={bannerQuery.isPending}>
          {banner ? (
            <Flex vertical gap="large">
              <div>
                <Typography.Text type="secondary">Current image</Typography.Text>
                <div style={{ marginTop: 8 }}>
                  <Image
                    src={assetUrl(banner.file_name)}
                    alt="Current banner"
                    width={320}
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
              <Form<BannerFormValues>
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{ images: [] }}
                onFinish={(values) => replaceMutation.mutate(values)}
              >
                <Form.Item
                  label="New image"
                  name="images"
                  extra="JPG or PNG. The current image is deleted when you save."
                  rules={[{ required: true, type: "array", min: 1, message: "Choose a new image" }]}
                >
                  <ImageUploadField maxCount={1} />
                </Form.Item>
                <FormActions
                  submitLabel="Replace image"
                  submitting={replaceMutation.isPending}
                  submitDisabled={!selectedImages.length}
                  onCancel={goToList}
                />
              </Form>
            </Flex>
          ) : (
            <Empty description="This banner no longer exists" />
          )}
        </Card>
      )}
    </>
  );
}
