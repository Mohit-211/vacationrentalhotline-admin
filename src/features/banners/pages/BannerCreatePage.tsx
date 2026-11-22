import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Card, Form } from "antd";
import { useNavigate } from "react-router";
import { FormActions } from "@/components/FormActions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { getImageChanges } from "@/utils/images";
import { bannerKeys, createBanners } from "../api";
import type { BannerFormValues } from "../types";

export function BannerCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goToList = () => navigate(paths.banners);

  const createMutation = useMutation({
    mutationFn: async ({ images }: BannerFormValues) => {
      const { newFiles } = await getImageChanges(images);
      await createBanners(newFiles);
    },
    onSuccess: async () => {
      message.success("Banners added");
      await queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      goToList();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not add the banners.")),
  });

  return (
    <>
      <PageHeader
        title="Add banners"
        subtitle="Each image becomes a banner on the app's home screen"
        onBack={goToList}
      />
      <Card>
        <Form<BannerFormValues>
          layout="vertical"
          requiredMark={false}
          initialValues={{ images: [] }}
          onFinish={(values) => createMutation.mutate(values)}
        >
          <Form.Item
            label="Images"
            name="images"
            extra="JPG or PNG. Images over 1 MB are resized before upload."
            rules={[{ required: true, type: "array", min: 1, message: "Add at least one image" }]}
          >
            <ImageUploadField />
          </Form.Item>
          <FormActions
            submitLabel="Add banners"
            submitting={createMutation.isPending}
            onCancel={goToList}
          />
        </Form>
      </Card>
    </>
  );
}
