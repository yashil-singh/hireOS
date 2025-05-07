import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const BarchartHorizontal = ({
  averageDurations,
}: {
  averageDurations: Record<string, number>;
}) => {
  const colorPalette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const chartData = Object.entries(averageDurations).map(
    ([step, duration], index) => ({
      step,
      duration,
      fill: colorPalette[index % colorPalette.length],
    }),
  );

  const chartConfig: ChartConfig = {
    duration: {
      label: "Avg duration",
    },
  };

  chartData.forEach((item) => {
    chartConfig[item.step] = {
      label: item.step
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      color: item.fill,
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 25,
          right: 25,
        }}
      >
        <YAxis
          dataKey="step"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label || value
          }
        />
        <XAxis dataKey="duration" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="duration" layout="vertical" radius={5}>
          <LabelList
            dataKey="duration"
            position="right"
            className="font-semibold"
            formatter={(value: number) => `${value.toFixed(1)} days`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default BarchartHorizontal;
