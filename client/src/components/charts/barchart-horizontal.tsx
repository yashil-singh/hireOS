import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { step: "short-listed", candidates: 275, fill: "var(--chart-1)" },
  { step: "first-interview", candidates: 200, fill: "var(--chart-2)" },
  { step: "second-interview", candidates: 187, fill: "var(--chart-3)" },
  { step: "third-interview", candidates: 173, fill: "var(--chart-4)" },
  { step: "assessment", candidates: 90, fill: "var(--chart-5)" },
  { step: "offer-letter", candidates: 100, fill: "var(--chart-1)" },
];

const chartConfig = {
  candidates: {
    label: "Candidates",
  },
  "short-listed": {
    label: "Short Listed",
    color: "var(--chart-1)",
  },
  "first-interview": {
    label: "First Interview",
    color: "var(--chart-2)",
  },
  "second-interview": {
    label: "Second Interview",
    color: "var(--chart-3)",
  },
  "third-interview": {
    label: "Third Interview",
    color: "var(--chart-4)",
  },
  assessment: {
    label: "Assessment",
    color: "var(--chart-5)",
  },
  "offer-letter": {
    label: "Offer Letter",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const BarchartHorizontal = () => {
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
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        <XAxis dataKey="candidates" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="candidates" layout="vertical" radius={5}>
          <LabelList
            dataKey="candidates"
            position="right"
            className="font-semibold"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default BarchartHorizontal;
