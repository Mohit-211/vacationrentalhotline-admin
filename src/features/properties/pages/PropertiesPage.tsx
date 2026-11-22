import { DownloadOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Alert, App, Button, Card, Segmented } from "antd";
import { Link } from "react-router";
import { fetchAllPages } from "@/api/pagination";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SearchField } from "@/components/SearchField";
import { paths } from "@/routes/paths";
import { downloadCsv } from "@/utils/csv";
import { getErrorMessage } from "@/utils/errors";
import { formatDate, formatNumber } from "@/utils/format";
import { useListParams } from "@/utils/useListParams";
import { fetchProperties, propertyKeys } from "../api";
import { PropertiesTable, type PropertyRow } from "../components/PropertiesTable";
import type { PropertyStatus } from "../types";

const FILTERS = ["status", "customerId"] as const;

export function PropertiesPage() {
  const { message } = App.useApp();
  const { search, page, pageSize, filters, listParams, setSearch, setFilter, setPage } =
    useListParams(FILTERS);
  const status = filters.status as PropertyStatus | undefined;
  const params = { ...listParams, status, customerId: filters.customerId };
  const propertiesQuery = useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: () => fetchProperties(params),
    placeholderData: keepPreviousData,
  });

  const exportMutation = useMutation({
    mutationFn: () =>
      fetchAllPages(fetchProperties, {
        search: params.search,
        status,
        customerId: params.customerId,
      }),
    onSuccess: exportProperties,
    onError: (error) => message.error(getErrorMessage(error, "Could not export the properties.")),
  });

  return (
    <>
      <PageHeader
        title="Properties"
        subtitle="Rental properties on customer accounts, newest first"
        extra={
          <>
            <Segmented<PropertyStatus | "all">
              aria-label="Cover status"
              value={status ?? "all"}
              onChange={(value) => setFilter("status", value === "all" ? undefined : value)}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search address, owner or customer"
              label="Search properties"
            />
            <Button
              icon={<DownloadOutlined />}
              loading={exportMutation.isPending}
              disabled={!propertiesQuery.data?.meta.total}
              onClick={() => exportMutation.mutate()}
            >
              Export CSV
            </Button>
          </>
        }
      />
      {filters.customerId && (
        <Alert
          type="info"
          showIcon
          className="page-alert"
          title="Showing one customer's properties."
          action={<Link to={paths.properties}>Show all properties</Link>}
        />
      )}
      <Card>
        {propertiesQuery.error ? (
          <QueryErrorResult
            error={propertiesQuery.error}
            onRetry={() => propertiesQuery.refetch()}
          />
        ) : (
          <PropertiesTable
            properties={propertiesQuery.data?.data}
            loading={propertiesQuery.isFetching}
            showCustomer
            emptyText={search || status ? "No properties match" : "No properties yet"}
            pagination={{
              current: page,
              pageSize,
              total: propertiesQuery.data?.meta.total,
              showSizeChanger: true,
              showTotal: (total) => `${formatNumber(total)} properties`,
              onChange: setPage,
            }}
          />
        )}
      </Card>
    </>
  );
}

function exportProperties(properties: PropertyRow[]): void {
  downloadCsv(
    "properties.csv",
    [
      "Address line 1",
      "Address line 2",
      "City",
      "State or province",
      "Postal code",
      "Country",
      "Owner name",
      "Owner email",
      "Owner second email",
      "Owner phone",
      "Owner second phone",
      "Customer",
      "Customer email",
      "Status",
      "Free cover",
      "Cover ends",
      "Renews",
      "Added",
    ],
    properties.map((property) => [
      property.addressLine1,
      property.addressLine2,
      property.city,
      property.regionCode,
      property.postalCode,
      property.countryCode,
      property.ownerName,
      property.ownerEmail,
      property.ownerAltEmail,
      property.ownerPhone,
      property.ownerAltPhone,
      property.customer?.name,
      property.customer?.email,
      property.status === "active" ? "Active" : "Inactive",
      property.complimentary ? "Yes" : "No",
      formatDate(property.subscriptionEndsAt),
      property.autoRenews ? "Yes" : "No",
      formatDate(property.createdAt),
    ]),
  );
}
