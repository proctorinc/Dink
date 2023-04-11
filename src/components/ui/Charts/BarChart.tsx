import { type FC } from "react";
import { type BarDatum, ResponsiveBar } from "@nivo/bar";

type BarChartProps = {
  data: BarDatum[];
  keys: string[];
  progress?: boolean;
  floatRight?: boolean;
};

export const BarChart: FC<BarChartProps> = ({
  data,
  keys,
  progress,
  floatRight,
}) => {
  const theme = {
    fontSize: 15,
  };

  const patterns = [
    {
      id: "dots",
      type: "patternDots",
      background: "#00C6C5",
      color: "rgb(22, 123, 141, 0.1)",
      size: 6,
      padding: 4,
      stagger: true,
    },
    {
      id: "lines",
      type: "patternLines",
      background: "#3D3F71",
      color: "rgba(255, 255, 255, 0.05)",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
    {
      id: "gradient",
      type: "linearGradient",
      colors: [{ offset: 0, color: "#00C6C5" }],
    },
  ];

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
      // legends={[
      //   {
      //     dataFrom: "keys",
      //     anchor: "bottom-right",
      //     direction: "column",
      //     justify: false,
      //     translateX: 120,
      //     translateY: 0,
      //     itemsSpacing: 2,
      //     itemWidth: 100,
      //     itemHeight: 20,
      //     itemDirection: "left-to-right",
      //     itemOpacity: 0.85,
      //     symbolSize: 20,
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemOpacity: 1,
      //         },
      //       },
      //     ],
      //   },
      // ]}
      // role="application"
      // ariaLabel="Nivo bar chart demo"
      // barAriaLabel={function (e) {
      //   return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      // }}
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
