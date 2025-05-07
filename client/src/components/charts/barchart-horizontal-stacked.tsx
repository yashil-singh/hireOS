import {
  Bar,
  BarChart,
  CartesianGrid,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";

const chartConfig = {
  moved: {
    label: "Moved",
    color: "var(--chart-1)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--destructive)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type BarchartHorizontalStackedProps = {
  stageCounts: {
    stepTitle: string;
    counts: {
      pending: number;
      completed: number;
      cancelled: number;
    };
  }[];
};

const ChartTooltipContent = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0);

  return (
    <div className="bg-background rounded-md border p-3 text-xs shadow-md">
      <div className="mb-2 font-medium">{label}</div>
      {payload.map((entry) => {
        const percent = total ? ((entry.value ?? 0) / total) * 100 : 0;

        return (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span
              className="cap flex items-center gap-1 capitalize"
              style={{ color: entry.color }}
            >
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="tabular-nums">
              {entry.value} ({percent.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

const BarchartHorizontalStacked = ({
  stageCounts,
}: BarchartHorizontalStackedProps) => {
  const chartData = stageCounts.map((item) => ({
    step: item.stepTitle,
    moved: item.counts.completed || 0,
    rejected: item.counts.cancelled || 0,
    pending: item.counts.pending || 0,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          left: 55,
        }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="step"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="capitalize"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="moved" stackId="a" fill="var(--chart-2)" />
        <Bar dataKey="rejected" stackId="a" fill="var(--destructive)" />
        <Bar dataKey="pending" stackId="a" fill="var(--chart-4)" />
      </BarChart>
    </ChartContainer>
  );
};

export default BarchartHorizontalStacked;
