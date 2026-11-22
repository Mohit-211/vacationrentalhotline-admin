import { Col, Form, Input, InputNumber, Row } from "antd";
import { FormActions } from "@/components/FormActions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { ServiceFormValues } from "../types";

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
}

export function ServiceForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  return (
    <Form<ServiceFormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={onSubmit}
      style={{ maxWidth: 880 }}
    >
      <Form.Item
        label="Service name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Enter the service name" }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Abbreviation"
            name="abbreviation"
            rules={[{ required: true, whitespace: true, message: "Enter an abbreviation" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Enter a price" }]}
          >
            <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Images"
        name="images"
        extra="JPG or PNG. Images over 1 MB are resized before upload."
      >
        <ImageUploadField />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Write a description" }]}
      >
        <RichTextEditor aria-label="Service description" />
      </Form.Item>
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
