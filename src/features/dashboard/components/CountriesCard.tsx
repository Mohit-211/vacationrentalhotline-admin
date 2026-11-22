import { Card, Flex, Table, type TableProps } from "antd";
import { CountryFlag } from "@/components/CountryFlag";
import { useCountries } from "@/features/locations/api";
import { formatNumber } from "@/utils/format";
import type { Stats } from "../types";

type CountryCount = Stats["properties"]["activeByCountry"][number];

interface CountriesCardProps {
  countries: CountryCount[] | undefined;
  loading: boolean;
}

export function CountriesCard({ countries, loading }: CountriesCardProps) {
  const { data: countryList } = useCountries();
  const columns: TableProps<CountryCount>["columns"] = [
    {
      title: "Country",
      dataIndex: "countryCode",
      render: (code: string) => (
        <Flex align="center" gap="small">
          <CountryFlag code={code} />
          {countryList?.find((country) => country.code === code)?.name ?? code}
        </Flex>
      ),
    },
    {
      title: "Active properties",
      dataIndex: "active",
      align: "right",
      render: (count: number) => formatNumber(count),
    },
  ];

  return (
    <Card title="Active properties by country" className="card-fill">
      <Table
        size="small"
        rowKey="countryCode"
        columns={columns}
        dataSource={countries}
        loading={loading}
        locale={{ emptyText: "No active properties yet" }}
        pagination={false}
      />
    </Card>
  );
}
