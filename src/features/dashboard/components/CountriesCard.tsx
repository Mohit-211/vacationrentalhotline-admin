import { Card, Flex, Table, Typography, type TableProps } from "antd";
import { CountryFlag } from "@/components/CountryFlag";
import { formatNumber } from "@/utils/format";
import type { CountryPropertyCount } from "../types";

interface CountriesCardProps {
  countries: CountryPropertyCount[] | undefined;
  loading: boolean;
  error: unknown;
}

const columns: TableProps<CountryPropertyCount>["columns"] = [
  {
    title: "Country",
    dataIndex: "country",
    render: (country: string) => (
      <Flex align="center" gap="small">
        <CountryFlag country={country} />
        {country}
      </Flex>
    ),
  },
  {
    title: "Properties",
    dataIndex: "property_count",
    align: "right",
    render: (count: number) => formatNumber(count),
  },
];

export function CountriesCard({ countries, loading, error }: CountriesCardProps) {
  return (
    <Card title="Properties by country" className="card-fill">
      {error ? (
        <Typography.Text type="danger">Could not load countries</Typography.Text>
      ) : (
        <Table
          size="small"
          rowKey="country"
          columns={columns}
          dataSource={countries}
          loading={loading}
          locale={{ emptyText: "No properties yet" }}
          pagination={{ pageSize: 5, size: "small", hideOnSinglePage: true }}
        />
      )}
    </Card>
  );
}
