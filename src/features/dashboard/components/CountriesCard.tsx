import { Card, Empty, Flex, List, Typography } from "antd";
import { CountryFlag } from "@/components/CountryFlag";
import { formatNumber } from "@/utils/format";
import type { CountryPropertyCount } from "../types";

interface CountriesCardProps {
  countries: CountryPropertyCount[] | undefined;
  loading: boolean;
  error: unknown;
}

export function CountriesCard({ countries, loading, error }: CountriesCardProps) {
  return (
    <Card title="Properties by country" style={{ height: "100%" }} loading={loading}>
      {error ? (
        <Typography.Text type="danger">Could not load countries</Typography.Text>
      ) : countries?.length ? (
        <List
          dataSource={countries}
          renderItem={(item) => (
            <List.Item key={item.country}>
              <Flex align="center" gap="small">
                <CountryFlag country={item.country} />
                <Typography.Text>{item.country}</Typography.Text>
              </Flex>
              <Typography.Text strong>{formatNumber(item.property_count)}</Typography.Text>
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No properties yet" />
      )}
    </Card>
  );
}
