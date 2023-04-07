import { ResponsiveLine, type Serie } from "@nivo/line";
import { type FC } from "react";

type LineChartProps = {
  data: Serie[];
};

export const LineChart: FC<LineChartProps> = ({ data }) => (
  <ResponsiveLine
    data={data}
    colors={["#00C6C5"]}
    defs={[
      {
        id: "gradient",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "#00C6C5" },
          { offset: 100, color: "#126473" },
        ],
      },
    ]}
    fill={[{ match: "*", id: "gradient" }]}
    margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    curve="catmullRom"
    axisTop={null}
    axisRight={null}
    enableGridX={false}
    enableGridY={false}
    enableCrosshair={false}
    enableSlices={false}
    axisBottom={{
      tickSize: 0,
    }}
    axisLeft={{
      tickSize: 0,
    }}
    enablePoints={false}
    enableArea={true}
    animate={true}
    lineWidth={5}
  />
);
