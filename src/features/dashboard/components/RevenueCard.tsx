import { useQuery } from "@tanstack/react-query";
import { Card, Empty, Select, Spin, Typography } from "antd";
import { lazy, Suspense, useState } from "react";
import { dashboardKeys, fetchRevenueHistory } from "../api";
import { REVENUE_PERIODS, type RevenuePeriod } from "../types";

const RevenueChart = lazy(() =>
  import("./RevenueChart").then((module) => ({ default: module.RevenueChart })),
);

const chartFallback = <Spin style={{ display: "block", padding: 120 }} />;

/** Revenue for the chosen period, one column per time bucket. */
export function RevenueCard() {
  const [period, setPeriod] = useState<RevenuePeriod>("last 10 days");
  const revenueQuery = useQuery({
    queryKey: dashboardKeys.revenueHistory(period),
    queryFn: () => fetchRevenueHistory(period),
  });
  const buckets = revenueQuery.data ?? [];

  return (
    <Card
      title="Revenue"
      extra={
        <Select<RevenuePeriod>
          aria-label="Revenue period"
          value={period}
          onChange={setPeriod}
          options={REVENUE_PERIODS.map((option) => ({ ...option }))}
          style={{ width: 160 }}
        />
      }
    >
      {revenueQuery.error ? (
        <Typography.Text type="danger">Could not load revenue</Typography.Text>
      ) : revenueQuery.isPending ? (
        chartFallback
      ) : buckets.length ? (
        <Suspense fallback={chartFallback}>
          <RevenueChart buckets={buckets} />
        </Suspense>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No payments in this period" />
      )}
    </Card>
  );
}
