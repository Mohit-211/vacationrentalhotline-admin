import { DownloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Input } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { matchesQuery } from "@/utils/search";
import { fetchProperties, propertyKeys } from "../api";
import { PropertiesTable } from "../components/PropertiesTable";
import { exportPropertiesCsv } from "../export";

export function PropertiesPage() {
  const [search, setSearch] = useState("");
  const propertiesQuery = useQuery({ queryKey: propertyKeys.all, queryFn: fetchProperties });

  const properties = useMemo(
    () =>
      (propertiesQuery.data ?? []).filter((property) =>
        matchesQuery(
          search,
          property.property_owner_name,
          property.property_owner_email_1,
          property.property_owner_email_2,
          property.full_address,
        ),
      ),
    [propertiesQuery.data, search],
  );

  return (
    <>
      <PageHeader
        title="Properties"
        subtitle="Rental properties registered in the app"
        extra={
          <>
            <Input.Search
              allowClear
              placeholder="Search owner, email or address"
              aria-label="Search properties"
              onChange={(event) => setSearch(event.target.value)}
              className="toolbar-search"
            />
            <Button
              icon={<DownloadOutlined />}
              disabled={!properties.length}
              onClick={() => exportPropertiesCsv(properties, "properties.csv")}
            >
              Export CSV
            </Button>
          </>
        }
      />
      <Card>
        {propertiesQuery.error ? (
          <QueryErrorResult
            error={propertiesQuery.error}
            onRetry={() => propertiesQuery.refetch()}
          />
        ) : (
          <PropertiesTable properties={properties} loading={propertiesQuery.isPending} />
        )}
      </Card>
    </>
  );
}
