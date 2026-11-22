import { Col, Form, Input, Row, Select } from "antd";
import { layoutSizes } from "@/styles/theme";
import { useCountries } from "./api";

interface AddressPlaceFieldsProps {
  /** Whether the fields must be filled (properties) or may stay empty (a customer's address). */
  required: boolean;
}

/**
 * Country, state or province, city and postal code, for forms whose fields are named
 * countryCode, regionCode, city and postalCode. The state list follows the chosen country.
 */
export function AddressPlaceFields({ required }: AddressPlaceFieldsProps) {
  const form = Form.useFormInstance();
  const { data: countries, isPending } = useCountries();
  const countryCode = Form.useWatch<string | undefined>("countryCode", form);
  const country = countries?.find((item) => item.code === countryCode);
  const regionLabel = country?.regionLabel ?? "State or province";
  const gutter: [number, number] = [layoutSizes.gridGutter, 0];

  return (
    <Row gutter={gutter}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Country"
          name="countryCode"
          rules={required ? [{ required: true, message: "Choose a country" }] : []}
        >
          <Select
            placeholder="Choose a country"
            loading={isPending}
            allowClear={!required}
            options={countries?.map((item) => ({ value: item.code, label: item.name }))}
            // A state of one country is meaningless in another.
            onChange={() => form.setFieldValue("regionCode", undefined)}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label={regionLabel}
          name="regionCode"
          rules={
            required ? [{ required: true, message: `Choose a ${regionLabel.toLowerCase()}` }] : []
          }
        >
          <Select
            showSearch
            optionFilterProp="label"
            disabled={!country}
            allowClear={!required}
            placeholder={
              country ? `Choose a ${regionLabel.toLowerCase()}` : "Choose a country first"
            }
            options={country?.regions.map((region) => ({ value: region.code, label: region.name }))}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="City"
          name="city"
          rules={required ? [{ required: true, whitespace: true, message: "Enter the city" }] : []}
        >
          <Input autoComplete="address-level2" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label={country?.postalCodeLabel ?? "Postal code"}
          name="postalCode"
          rules={
            required ? [{ required: true, whitespace: true, message: "Enter the postal code" }] : []
          }
        >
          <Input
            autoComplete="postal-code"
            placeholder={country ? `For example ${country.postalCodeExample}` : undefined}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
