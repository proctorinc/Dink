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
          { offset: 90, color: "#167B8D" },
          // { offset: 100, color: "#292B4C00" },
        ],
      },
    ]}
    fill={[{ match: "*", id: "gradient" }]}
    margin={{ top: 25 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      max: "auto",
      min: "auto",
      stacked: true,
      reverse: false,
    }}
    areaOpacity={1}
    curve="cardinal"
    axisTop={null}
    axisRight={null}
    enableGridX={false}
    enableGridY={false}
    enableCrosshair={false}
    enableSlices={false}
    enablePointLabel={false}
    axisBottom={{
      tickSize: 0,
    }}
    axisLeft={{
      tickSize: 0,
    }}
    pointSize={12}
    pointColor="#167B8D"
    pointBorderWidth={3}
    pointBorderColor="#00C6C5"
    enablePoints={false}
    enableArea={true}
    lineWidth={5}
  />
);
