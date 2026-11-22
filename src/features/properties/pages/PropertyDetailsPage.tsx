import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Empty, Flex, List } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { displayValue, formatDateTime } from "@/utils/format";
import { fetchProperty, propertyKeys } from "../api";
import { SubscriptionTag } from "../components/SubscriptionTag";

export function PropertyDetailsPage() {
  const { propertyId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const propertyQuery = useQuery({
    queryKey: propertyKeys.detail(propertyId),
    queryFn: () => fetchProperty(propertyId),
  });
  const property = propertyQuery.data;
  const notes = property?.property_notes ?? [];

  // Opened from a user's page or the property list: go back there; opened directly: go to the list.
  const goBack = () => (location.key === "default" ? navigate(paths.properties) : navigate(-1));

  return (
    <>
      <PageHeader
        title="Property details"
        subtitle={property?.full_address ?? undefined}
        onBack={goBack}
      />
      {propertyQuery.error ? (
        <QueryErrorResult error={propertyQuery.error} onRetry={() => propertyQuery.refetch()} />
      ) : (
        <Flex vertical gap="large">
          <Card title="Address" loading={propertyQuery.isPending}>
            <Descriptions
              column={{ xs: 1, md: 2, xl: 3 }}
              items={[
                {
                  key: "line1",
                  label: "Address line 1",
                  children: displayValue(property?.address_line_1),
                },
                {
                  key: "line2",
                  label: "Address line 2",
                  children: displayValue(property?.address_line_2),
                },
                { key: "city", label: "City", children: displayValue(property?.city) },
                { key: "state", label: "State", children: displayValue(property?.state) },
                { key: "zip", label: "Zip code", children: displayValue(property?.zip_code) },
                { key: "country", label: "Country", children: displayValue(property?.country) },
              ]}
            />
          </Card>
          <Card title="Owner" loading={propertyQuery.isPending}>
            <Descriptions
              column={{ xs: 1, md: 2, xl: 3 }}
              items={[
                {
                  key: "name",
                  label: "Name",
                  children: displayValue(property?.property_owner_name),
                },
                {
                  key: "email1",
                  label: "Email 1",
                  children: displayValue(property?.property_owner_email_1),
                },
                {
                  key: "email2",
                  label: "Email 2",
                  children: displayValue(property?.property_owner_email_2),
                },
                {
                  key: "phone1",
                  label: "Phone 1",
                  children: displayValue(property?.property_owner_mobile_number_1),
                },
                {
                  key: "phone2",
                  label: "Phone 2",
                  children: displayValue(property?.property_owner_mobile_number_2),
                },
              ]}
            />
          </Card>
          <Card title="Subscription" loading={propertyQuery.isPending}>
            <Descriptions
              column={{ xs: 1, md: 2, xl: 4 }}
              items={[
                {
                  key: "status",
                  label: "Status",
                  children: <SubscriptionTag status={property?.subscription_status} />,
                },
                {
                  key: "start",
                  label: "Starts",
                  children: formatDateTime(property?.subscription_start_date),
                },
                {
                  key: "end",
                  label: "Ends",
                  children: formatDateTime(property?.subscription_end_date),
                },
                { key: "validity", label: "Validity", children: displayValue(property?.validity) },
              ]}
            />
          </Card>
          <Card title="Notes" loading={propertyQuery.isPending}>
            {notes.length ? (
              <List
                dataSource={notes}
                renderItem={(note, index) => (
                  <List.Item key={note.id ?? index}>{note.notes}</List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notes for this property"
              />
            )}
          </Card>
        </Flex>
      )}
    </>
  );
}
