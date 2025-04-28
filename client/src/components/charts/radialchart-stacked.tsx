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

const chartData = [{ month: "january", rejected: 1260, accepted: 570 }];

const chartConfig = {
  accepted: {
    label: "Accepted",
    color: "var(--chart-1)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const RadialchartStacked = () => {
  const totalVisitors = chartData[0].rejected + chartData[0].accepted;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[300px]"
    >
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
                      Candidates
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
          cornerRadius={5}
          fill="var(--color-accepted)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="rejected"
          fill="var(--color-rejected)"
          stackId="a"
          cornerRadius={5}
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
          ]}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default RadialchartStacked;
