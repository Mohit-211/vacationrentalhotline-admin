import { useQuery, type QueryKey } from "@tanstack/react-query";
import { Card, Segmented, Statistic, Typography } from "antd";
import { useState } from "react";
import { EMPTY_VALUE, formatNumber } from "@/utils/format";
import { REGISTRATION_PERIODS, type RegistrationPeriod } from "../types";

interface PeriodCountCardProps {
  title: string;
  queryKey: (period: RegistrationPeriod) => QueryKey;
  fetchCount: (period: RegistrationPeriod) => Promise<number>;
}

/** A count for a chosen period (today / this week / this month). */
export function PeriodCountCard({ title, queryKey, fetchCount }: PeriodCountCardProps) {
  const [period, setPeriod] = useState<RegistrationPeriod>("week");
  const countQuery = useQuery({ queryKey: queryKey(period), queryFn: () => fetchCount(period) });
  const periodLabel = REGISTRATION_PERIODS.find((option) => option.value === period)?.label ?? "";

  return (
    <Card
      title={title}
      className="card-fill"
      extra={
        <Segmented<RegistrationPeriod>
          size="small"
          options={REGISTRATION_PERIODS.map((option) => ({ ...option }))}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <Statistic
        title={`Registered ${periodLabel.toLowerCase()}`}
        loading={countQuery.isPending}
        value={countQuery.error ? EMPTY_VALUE : formatNumber(countQuery.data)}
      />
      {countQuery.error && (
        <Typography.Text type="danger">Could not load this number</Typography.Text>
      )}
    </Card>
  );
}
