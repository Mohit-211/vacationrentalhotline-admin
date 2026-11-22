import { ContactsOutlined, DollarOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row } from "antd";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { useProfile } from "@/features/auth/useProfile";
import { paths } from "@/routes/paths";
import { layoutSizes } from "@/styles/theme";
import { isForbiddenError } from "@/utils/errors";
import { formatCurrency } from "@/utils/format";
import {
  dashboardKeys,
  fetchContactFormCount,
  fetchNewPropertyCount,
  fetchNewUserCount,
  fetchPropertyCount,
  fetchPropertyCountsByCountry,
  fetchTopPropertyOwners,
  fetchTotalRevenue,
  fetchUserCount,
} from "../api";
import { CountriesCard } from "../components/CountriesCard";
import { PeriodCountCard } from "../components/PeriodCountCard";
import { RevenueCard } from "../components/RevenueCard";
import { StatCard } from "../components/StatCard";
import { TopOwnersCard } from "../components/TopOwnersCard";

export function DashboardPage() {
  const { data: profile } = useProfile();
  const userCount = useQuery({ queryKey: dashboardKeys.userCount, queryFn: fetchUserCount });
  const contactFormCount = useQuery({
    queryKey: dashboardKeys.contactFormCount,
    queryFn: fetchContactFormCount,
  });
  const propertyCount = useQuery({
    queryKey: dashboardKeys.propertyCount,
    queryFn: fetchPropertyCount,
  });
  const totalRevenue = useQuery({
    queryKey: dashboardKeys.totalRevenue,
    queryFn: fetchTotalRevenue,
  });
  const topOwners = useQuery({
    queryKey: dashboardKeys.topOwners,
    queryFn: fetchTopPropertyOwners,
  });
  const countries = useQuery({
    queryKey: dashboardKeys.countries,
    queryFn: fetchPropertyCountsByCountry,
  });

  const header = (
    <PageHeader
      title={profile?.name ? `Welcome back, ${profile.name}` : "Welcome back"}
      subtitle="A snapshot of the platform"
    />
  );

  // Employees (sub-admins) are refused the owner statistics; show "no access" for the page.
  if (isForbiddenError(topOwners.error)) {
    return (
      <>
        {header}
        <Card>
          <QueryErrorResult error={topOwners.error} />
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
            title="Registered users"
            icon={<TeamOutlined />}
            value={userCount.data}
            loading={userCount.isPending}
            error={userCount.error}
            link={{ to: paths.users, label: "View users" }}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Contact forms received"
            icon={<ContactsOutlined />}
            value={contactFormCount.data}
            loading={contactFormCount.isPending}
            error={contactFormCount.error}
            link={{ to: paths.contact, label: "View forms" }}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Properties"
            icon={<HomeOutlined />}
            tone="success"
            value={propertyCount.data}
            loading={propertyCount.isPending}
            error={propertyCount.error}
            link={{ to: paths.properties, label: "View properties" }}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Total revenue"
            icon={<DollarOutlined />}
            tone="success"
            value={totalRevenue.data}
            loading={totalRevenue.isPending}
            error={totalRevenue.error}
            format={formatCurrency}
            link={{ to: paths.payments, label: "View payments" }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <PeriodCountCard
            title="New users"
            queryKey={dashboardKeys.newUsers}
            fetchCount={fetchNewUserCount}
          />
        </Col>
        <Col xs={24} lg={12}>
          <PeriodCountCard
            title="New properties"
            queryKey={dashboardKeys.newProperties}
            fetchCount={fetchNewPropertyCount}
          />
        </Col>
        <Col xs={24} lg={12}>
          <TopOwnersCard
            owners={topOwners.data}
            loading={topOwners.isPending}
            error={topOwners.error}
          />
        </Col>
        <Col xs={24} lg={12}>
          <CountriesCard
            countries={countries.data}
            loading={countries.isPending}
            error={countries.error}
          />
        </Col>
        <Col span={24}>
          <RevenueCard />
        </Col>
      </Row>
    </>
  );
}
