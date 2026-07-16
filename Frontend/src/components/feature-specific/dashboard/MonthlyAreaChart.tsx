import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/common/ui/chart";

export interface MonthlyTrendItem {
  billing_date: string;
  transactions: number;
  net_purchase_value: string;
  fuel_liters: string;
}

export function MonthlyAreaChart({
  data,
  locale,
  t
}: {
  data: MonthlyTrendItem[];
  locale: string;
  t: any;
}) {
  if (!data.length) return <p className="text-sm text-muted-foreground p-4">{t.dashboard.noTrendData}</p>;

  // Transform data to ensure net_purchase_value is a number
  const chartData = data.map(d => ({
    ...d,
    net_purchase_value: parseFloat(d.net_purchase_value) || 0
  }));

  const chartConfig = {
    net_purchase_value: {
      label: t.dashboard.totalSpend,
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="h-[130px] w-full pt-1">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-net_purchase_value)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-net_purchase_value)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
          <XAxis
            dataKey="billing_date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={(value) => {
              if (!value) return '';
              const d = new Date(value);
              if (isNaN(d.getTime())) return value;
              return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
            }}
            fontSize={11}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="net_purchase_value"
            type="monotone"
            fill="url(#fillSpend)"
            stroke="var(--color-net_purchase_value)"
            strokeWidth={2.5}
            animationDuration={1500}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
