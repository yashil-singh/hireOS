import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartData = [
  { month: "January", hired: 186, rejected: 80 },
  { month: "February", hired: 305, rejected: 200 },
  { month: "March", hired: 237, rejected: 120 },
  { month: "April", hired: 73, rejected: 190 },
  { month: "May", hired: 209, rejected: 130 },
  { month: "June", hired: 214, rejected: 140 },
];

const chartConfig = {
  hired: {
    label: "Hired",
    color: "oklch(0.646 0.222 41.116)",
  },
  rejected: {
    label: "Rejected",
    color: "oklch(0.6 0.118 184.704)",
  },
} satisfies ChartConfig;

const BarChartStacked = () => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="hired"
          stackId="a"
          fill="var(--color-hired)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="rejected"
          stackId="a"
          fill="var(--color-rejected)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartStacked;
