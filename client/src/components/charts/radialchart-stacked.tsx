import {
  Label,
  Legend,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  accepted: {
    label: "Accepted",
    color: "var(--chart-2)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-1)",
  },
  pending: {
    label: "In-Process",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const RadialchartStacked = ({
  rejected,
  accepted,
  pending,
}: {
  rejected: number;
  accepted: number;
  pending: number;
}) => {
  const chartData = [{ rejected, accepted, pending }];

  const totalVisitors =
    chartData[0].rejected + chartData[0].accepted + chartData[0].pending;

  return (
    <ChartContainer config={chartConfig} className="mx-auto">
      <RadialBarChart data={chartData} innerRadius={80} outerRadius={130}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy || 0}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground"
                    >
                      Total Candidates
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="accepted"
          stackId="a"
          fill="var(--color-accepted)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="pending"
          fill="var(--color-pending)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="rejected"
          fill="var(--color-rejected)"
          stackId="a"
          className="stroke-transparent stroke-2"
        />
        <Legend
          iconSize={14}
          layout="vertical"
          verticalAlign="top"
          align="left"
          payload={[
            {
              value: "Accepted",
              type: "circle",
              color: "var(--color-accepted)",
            },
            {
              value: "Rejected",
              type: "circle",
              color: "var(--color-rejected)",
            },
            {
              value: "In-Process",
              type: "circle",
              color: "var(--color-pending)",
            },
          ]}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default RadialchartStacked;
