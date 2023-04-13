import { type FC } from "react";
import { type BarDatum, ResponsiveBar } from "@nivo/bar";

type BarChartProps = {
  data: BarDatum[];
  keys: string[];
  progress?: boolean;
  floatRight?: boolean;
};

export const BarChart: FC<BarChartProps> = ({ data, keys, floatRight }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="title"
      margin={{ top: 0, bottom: 5, left: 0, right: 0 }}
      colors={["#00C6C5", "#3D3F71"]}
      label="id"
      enableLabel={false}
      enableGridX={false}
      enableGridY={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      borderRadius={5}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "country",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "food",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      valueFormat=" >-$,.2f"
      tooltip={(data) => (
        <div
          className={`${
            floatRight ? "translate-x-16" : "-translate-x-12"
          } flex w-fit -translate-y-2 items-center gap-2 rounded-xl bg-primary-med px-3 py-1 font-bold shadow-2xl`}
        >
          <div className="flex flex-col">
            <span>{data.id}</span>
            <span className="text-primary-light">{data.formattedValue}</span>
          </div>
        </div>
      )}
    />
  );
};
