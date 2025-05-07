import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  eachDayOfInterval,
  format,
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
} from "date-fns";
import { ApplicationData } from "@/services/dashboard/types";

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const Barchart = ({
  weekly,
  monthly,
  yearly,
  type,
}: {
  weekly: ApplicationData[];
  monthly: ApplicationData[];
  yearly: ApplicationData[];
  type: "weekly" | "monthly" | "yearly";
}) => {
  function formatWeeklyData(data: ApplicationData[]) {
    const now = new Date();
    const weekDays = eachDayOfInterval({
      start: startOfWeek(now),
      end: endOfWeek(now),
    });

    return weekDays.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const entry = data.find((d) => {
        return d._id === dateStr;
      });
      return {
        label: format(day, "EEE"), // Mon, Tue
        applications: entry ? entry.count : 0,
      };
    });
  }

  function formatMonthlyData(data: ApplicationData[]) {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: startOfYear(now),
      end: endOfYear(now),
    });

    return months.map((month) => {
      const dateStr = format(month, "yyyy-MM");
      const entry = data.find((d) => d._id === dateStr);
      return {
        label: format(month, "MMMM"), // January, etc.
        applications: entry ? entry.count : 0,
      };
    });
  }

  function formatYearlyData(data: ApplicationData[]) {
    const years = eachYearOfInterval({
      start: new Date(parseInt(data[0]?._id) || new Date().getFullYear(), 0, 1),
      end: new Date(),
    });

    return years.map((year) => {
      const dateStr = format(year, "yyyy");
      const entry = data.find((d) => d._id === dateStr);
      return {
        label: dateStr,
        applications: entry ? entry.count : 0,
      };
    });
  }

  const chartData =
    type === "weekly"
      ? formatWeeklyData(weekly)
      : type === "monthly"
        ? formatMonthlyData(monthly)
        : formatYearlyData(yearly);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          tickFormatter={(value) =>
            type === "monthly" ? value.slice(0, 3) : value
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="applications"
          fill="var(--color-applications)"
          radius={8}
          maxBarSize={50}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default Barchart;
