import { EditOutlined, ExportOutlined, StopOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Popconfirm,
  Row,
  Table,
  Typography,
  type TableProps,
} from "antd";
import { Link, useNavigate, useParams } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { useAuth } from "@/features/auth/AuthContext";
import { customerKeys } from "@/features/customers/api";
import { formatPlace, useCountries } from "@/features/locations/api";
import { PaymentStatusTag } from "@/features/payments/components/PaymentStatusTag";
import { paths } from "@/routes/paths";
import { useGoBack } from "@/routes/useGoBack";
import { layoutSizes } from "@/styles/theme";
import { getErrorMessage } from "@/utils/errors";
import {
  EMPTY_VALUE,
  displayValue,
  formatCents,
  formatDate,
  formatDateTime,
  formatLabel,
  formatPhone,
} from "@/utils/format";
import { cancelRenewal, deleteProperty, endCover, fetchProperty, propertyKeys } from "../api";
import { CoverTag } from "../components/CoverStatus";
import { coverSummary } from "../cover";
import { NotesCard } from "../components/NotesCard";
import type { PropertyDetails, PropertyPayment } from "../types";

export function PropertyDetailsPage() {
  const { propertyId = "" } = useParams();
  const navigate = useNavigate();
  // Back to the customer or list it was opened from; else to the property list.
  const goBack = useGoBack(paths.properties);
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const { can } = useAuth();
  const { data: countries } = useCountries();
  const propertyQuery = useQuery({
    queryKey: propertyKeys.detail(propertyId),
    queryFn: () => fetchProperty(propertyId),
  });
  const property = propertyQuery.data;

  /** Billing changes affect the customer's page and the lists too. */
  const refreshAll = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
      queryClient.invalidateQueries({ queryKey: customerKeys.all }),
    ]);

  const cancelRenewalMutation = useMutation({
    mutationFn: () => cancelRenewal(propertyId),
    onSuccess: async () => {
      message.success("Renewal cancelled. Cover lasts until the end of the paid period.");
      await refreshAll();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not cancel the renewal.")),
  });

  const endCoverMutation = useMutation({
    mutationFn: () => endCover(propertyId),
    onSuccess: async () => {
      message.success("Cover ended. The customer will be emailed within 15 minutes.");
      await refreshAll();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not end the cover.")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProperty(propertyId),
    onSuccess: async () => {
      message.success("Property deleted");
      const customerId = property?.customer.id;
      navigate(customerId ? paths.customer(customerId) : paths.properties, { replace: true });
      queryClient.removeQueries({ queryKey: propertyKeys.detail(propertyId) });
      await refreshAll();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the property.")),
  });

  const confirmEndCover = () =>
    modal.confirm({
      title: "End cover now?",
      content:
        "Cover ends immediately and renewal stops. Nothing is refunded, and to get cover back the customer has to pay again. They are emailed within 15 minutes.",
      okText: "End cover now",
      okButtonProps: { danger: true },
      onOk: () => endCoverMutation.mutateAsync(),
    });

  if (propertyQuery.error) {
    return (
      <>
        <PageHeader title="Property" onBack={goBack} />
        <Card>
          <QueryErrorResult
            error={propertyQuery.error}
            onRetry={() => propertyQuery.refetch()}
            notFoundText="This property doesn't exist or was deleted."
          />
        </Card>
      </>
    );
  }

  const covered = property?.status === "active";
  const title = property
    ? [property.addressLine1, property.addressLine2].filter(Boolean).join(", ")
    : "Property";
  const place = property ? `${formatPlace(property, countries)} ${property.postalCode}` : undefined;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={place}
        onBack={goBack}
        extra={
          property && (
            <>
              {can("billing.manage") && property.autoRenews && (
                <Popconfirm
                  title="Cancel the renewal?"
                  description={
                    <div className="confirm-text">
                      It stays covered until {formatDate(property.subscriptionEndsAt)}, then stops.
                      Nothing is refunded.
                    </div>
                  }
                  okText="Cancel renewal"
                  cancelText="Keep it"
                  onConfirm={() => cancelRenewalMutation.mutate()}
                >
                  <Button icon={<StopOutlined />} loading={cancelRenewalMutation.isPending}>
                    Cancel renewal
                  </Button>
                </Popconfirm>
              )}
              {can("billing.manage") && covered && !property.complimentary && (
                <Button danger loading={endCoverMutation.isPending} onClick={confirmEndCover}>
                  End cover now
                </Button>
              )}
              {can("customers.manage") && (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(paths.editProperty(property.id))}
                  >
                    Edit
                  </Button>
                  <DeleteButton
                    label="Delete"
                    itemName="this property"
                    description="Its notes are deleted too. Payments stay on record."
                    loading={deleteMutation.isPending}
                    disabled={covered}
                    disabledReason={
                      property.complimentary
                        ? "It is covered by the customer's free cover. Turn that off before deleting it."
                        : "Covered properties can't be deleted. Cancel its renewal or end its cover first."
                    }
                    onConfirm={() => deleteMutation.mutate()}
                  />
                </>
              )}
            </>
          )
        }
      />
      <Flex vertical gap="large">
        <Row gutter={[layoutSizes.gridGutter, layoutSizes.gridGutter]}>
          <Col xs={24} xl={12}>
            <Card title="Cover" className="card-fill" loading={propertyQuery.isPending}>
              {property && <CoverDescriptions property={property} />}
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card title="Owner" className="card-fill" loading={propertyQuery.isPending}>
              {property && <OwnerDescriptions property={property} />}
            </Card>
          </Col>
        </Row>
        <Card title="Payments" loading={propertyQuery.isPending}>
          {property && <PropertyPaymentsTable payments={property.payments} />}
        </Card>
        {property && (
          <NotesCard
            propertyId={property.id}
            notes={property.notes}
            canManage={can("customers.manage")}
          />
        )}
      </Flex>
    </>
  );
}

function CoverDescriptions({ property }: { property: PropertyDetails }) {
  const subscription = property.subscription;
  return (
    <Descriptions
      column={1}
      items={[
        {
          key: "status",
          label: "Status",
          children: (
            <Flex align="center" gap="small" wrap>
              <CoverTag property={property} />
              {coverSummary(property)}
            </Flex>
          ),
        },
        {
          key: "ends",
          label: "Paid until",
          children: formatDate(property.subscriptionEndsAt),
        },
        {
          key: "renews",
          label: "Renews automatically",
          children: property.autoRenews ? "Yes" : "No",
        },
        {
          key: "price",
          label: "Yearly price",
          children: subscription ? formatCents(subscription.unitAmountCents) : EMPTY_VALUE,
        },
        {
          key: "subscription",
          label: "Stripe subscription",
          children: subscription ? (
            <Flex vertical>
              {formatLabel(subscription.status)}
              <Typography.Text type="secondary" code>
                {subscription.stripeSubscriptionId}
              </Typography.Text>
            </Flex>
          ) : (
            EMPTY_VALUE
          ),
        },
        ...(subscription?.canceledAt
          ? [
              {
                key: "canceled",
                label: "Renewal cancelled",
                children: formatDateTime(subscription.canceledAt),
              },
            ]
          : []),
      ]}
    />
  );
}

function OwnerDescriptions({ property }: { property: PropertyDetails }) {
  return (
    <Descriptions
      column={1}
      items={[
        { key: "name", label: "Name", children: property.ownerName },
        {
          key: "email",
          label: "Email",
          children: <a href={`mailto:${property.ownerEmail}`}>{property.ownerEmail}</a>,
        },
        { key: "email2", label: "Second email", children: displayValue(property.ownerAltEmail) },
        { key: "phone", label: "Phone", children: formatPhone(property.ownerPhone) },
        {
          key: "phone2",
          label: "Second phone",
          children: formatPhone(property.ownerAltPhone),
        },
        {
          key: "customer",
          label: "Customer account",
          children: (
            <Flex vertical>
              <Link to={paths.customer(property.customer.id)}>{property.customer.name}</Link>
              <Typography.Text type="secondary">{property.customer.email}</Typography.Text>
            </Flex>
          ),
        },
        { key: "added", label: "Added", children: formatDate(property.createdAt) },
      ]}
    />
  );
}

function PropertyPaymentsTable({ payments }: { payments: PropertyPayment[] }) {
  const columns: TableProps<PropertyPayment>["columns"] = [
    {
      title: "Payment",
      key: "payment",
      render: (_, payment) => (
        <Flex vertical>
          <Flex align="center" gap="small" wrap>
            <Link to={paths.payment(payment.paymentId)}>
              {payment.paidAt ? `Paid ${formatDate(payment.paidAt)}` : "Not paid"}
            </Link>
            <PaymentStatusTag status={payment.status} />
          </Flex>
          <Typography.Text type="secondary">
            Covers {formatDate(payment.periodStart)} – {formatDate(payment.periodEnd)}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amountCents",
      align: "right",
      render: (cents: number) => formatCents(cents),
    },
    {
      title: "Receipt",
      dataIndex: "receiptUrl",
      responsive: ["sm"],
      render: (url: string | null) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View <ExportOutlined />
          </a>
        ) : (
          EMPTY_VALUE
        ),
    },
  ];
  return (
    <Table
      size="small"
      rowKey={(payment) => `${payment.paymentId}-${payment.periodStart}`}
      columns={columns}
      dataSource={payments}
      locale={{ emptyText: "No payments for this property" }}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: "max-content" }}
    />
  );
}
