import { ContactsOutlined, DollarOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Segmented } from "antd";
import { useSearchParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { useAuth } from "@/features/auth/AuthContext";
import { paths } from "@/routes/paths";
import { layoutSizes } from "@/styles/theme";
import { formatCents, formatNumber } from "@/utils/format";
import { fetchStats, statsQueryKey } from "../api";
import { CountriesCard } from "../components/CountriesCard";
import { StatCard } from "../components/StatCard";
import { TopCustomersCard } from "../components/TopCustomersCard";
import { TrendCard } from "../components/TrendCard";
import { STAT_PERIODS, type StatPeriod } from "../types";

const DEFAULT_PERIOD: StatPeriod = 30;

export function DashboardPage() {
  const { me, can } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const days =
    STAT_PERIODS.find((period) => period.value === Number(searchParams.get("days")))?.value ??
    DEFAULT_PERIOD;
  const periodLabel = STAT_PERIODS.find((period) => period.value === days)?.label ?? "";
  // One call for every figure; the previous period stays on screen while the next one loads.
  const statsQuery = useQuery({
    queryKey: statsQueryKey(days),
    queryFn: () => fetchStats(days),
    placeholderData: keepPreviousData,
  });
  const stats = statsQuery.data;
  const loading = statsQuery.isPending;
  const inPeriod = `in the last ${periodLabel}`;

  const header = (
    <PageHeader
      title={me?.name ? `Welcome back, ${me.name}` : "Welcome back"}
      subtitle="A snapshot of the platform"
      extra={
        <Segmented<StatPeriod>
          aria-label="Period"
          options={STAT_PERIODS.map((period) => ({ ...period }))}
          value={days}
          onChange={(value) =>
            setSearchParams(value === DEFAULT_PERIOD ? {} : { days: String(value) }, {
              replace: true,
            })
          }
        />
      }
    />
  );

  if (statsQuery.error) {
    return (
      <>
        {header}
        <Card>
          <QueryErrorResult error={statsQuery.error} onRetry={() => statsQuery.refetch()} />
        </Card>
      </>
    );
  }

  return (
    <>
      {header}
      <Row gutter={[layoutSizes.gridGutter, layoutSizes.gridGutter]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Customers"
            icon={<TeamOutlined />}
            value={stats && formatNumber(stats.customers.total)}
            caption={stats && `+${formatNumber(stats.customers.new)} ${inPeriod}`}
            loading={loading}
            link={
              can("customers.view") ? { to: paths.customers, label: "View customers" } : undefined
            }
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Active properties"
            icon={<HomeOutlined />}
            tone="success"
            value={stats && formatNumber(stats.properties.active)}
            caption={
              stats &&
              `${formatNumber(stats.properties.total)} in all, +${formatNumber(stats.properties.new)} ${inPeriod}`
            }
            loading={loading}
            link={
              can("customers.view") ? { to: paths.properties, label: "View properties" } : undefined
            }
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Revenue, all time"
            icon={<DollarOutlined />}
            tone="success"
            value={stats && formatCents(stats.revenue.totalCents)}
            caption={
              stats &&
              `${formatCents(stats.revenue.periodCents)} from ${formatNumber(stats.revenue.periodPayments)} payments ${inPeriod}`
            }
            loading={loading}
            link={
              can("customers.view") ? { to: paths.payments, label: "View payments" } : undefined
            }
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Contact forms"
            icon={<ContactsOutlined />}
            value={stats && formatNumber(stats.messages.total)}
            caption={stats && `+${formatNumber(stats.messages.new)} ${inPeriod}`}
            loading={loading}
            link={can("messages.view") ? { to: paths.messages, label: "View forms" } : undefined}
          />
        </Col>
        <Col span={24}>
          <TrendCard daily={stats?.daily} days={days} loading={loading} />
        </Col>
        <Col xs={24} lg={12}>
          <TopCustomersCard customers={stats?.topCustomers} loading={loading} />
        </Col>
        <Col xs={24} lg={12}>
          <CountriesCard countries={stats?.properties.activeByCountry} loading={loading} />
        </Col>
      </Row>
    </>
  );
}
