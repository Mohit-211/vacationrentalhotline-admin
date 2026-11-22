import { Col, Divider, Form, Input, Row, type FormInstance } from "antd";
import { FormActions } from "@/components/FormActions";
import { AddressPlaceFields } from "@/features/locations/AddressPlaceFields";
import { layoutSizes } from "@/styles/theme";
import type { PropertyValues } from "../types";

interface PropertyFormProps {
  form: FormInstance<PropertyValues>;
  initialValues?: Partial<PropertyValues>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: PropertyValues) => void;
  onCancel: () => void;
}

const PHONE_HINT = "Include the country code, such as +1 512 555 0111.";

/** Owner and address of a property, for adding and editing. */
export function PropertyForm({
  form,
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: PropertyFormProps) {
  const gutter: [number, number] = [layoutSizes.gridGutter, 0];

  return (
    <Form<PropertyValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Divider titlePlacement="start" plain>
        Owner
      </Divider>
      <Form.Item
        label="Owner name"
        name="ownerName"
        rules={[{ required: true, whitespace: true, message: "Enter the owner's name" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Row gutter={gutter}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Email"
            name="ownerEmail"
            rules={[
              { required: true, message: "Enter the owner's email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input type="email" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Second email"
            name="ownerAltEmail"
            rules={[{ type: "email", message: "Enter a valid email address" }]}
          >
            <Input type="email" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Phone"
            name="ownerPhone"
            extra={PHONE_HINT}
            rules={[
              { required: true, whitespace: true, message: "Enter the owner's phone number" },
            ]}
          >
            <Input type="tel" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Second phone" name="ownerAltPhone">
            <Input type="tel" autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>
      <Divider titlePlacement="start" plain>
        Address
      </Divider>
      <Form.Item
        label="Address line 1"
        name="addressLine1"
        rules={[{ required: true, whitespace: true, message: "Enter the street address" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item label="Address line 2" name="addressLine2">
        <Input autoComplete="off" />
      </Form.Item>
      <AddressPlaceFields required />
      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </Form>
  );
}
