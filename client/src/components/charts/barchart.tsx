import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", applications: 186 },
  { month: "February", applications: 305 },
  { month: "March", applications: 237 },
  { month: "April", applications: 73 },
  { month: "May", applications: 209 },
  { month: "June", applications: 214 },
  { month: "July", applications: 100 },
  { month: "August", applications: 180 },
  { month: "September", applications: 156 },
  { month: "October", applications: 284 },
  { month: "November", applications: 300 },
  { month: "December", applications: 320 },
];

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const Barchart = () => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="applications"
          fill="var(--color-applications)"
          radius={8}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default Barchart;
