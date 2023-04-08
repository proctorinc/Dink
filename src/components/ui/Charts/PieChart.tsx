import { type FC } from "react";
import { ResponsivePie } from "@nivo/pie";
import { IconButton } from "../Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

type PieChartProps = {
  data: unknown[];
  progress?: boolean;
  floatRight?: boolean;
};

export const PieChart: FC<PieChartProps> = ({ data, progress, floatRight }) => {
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
      background: "#167B8D",
      color: "rgba(255, 255, 255, 0.05)",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
    {
      id: "gradient",
      type: "linearGradient",
      colors: [
        { offset: 0, color: "#00C6C5" },
        // { offset: 100, color: "#126473" },
      ],
    },
  ];

  return (
    <ResponsivePie
      theme={theme}
      data={data}
      colors={progress ? ["#00C6C5", "#3D3F71"] : []}
      defs={patterns}
      fill={
        progress
          ? [
              {
                match: (d) => d.arc.index % 2 === 0,
                id: "gradient",
              },
              { match: "*", id: "gradientPrimary" },
            ]
          : [
              {
                match: (d) => d.arc.angle < 0.2 || d.arc.index % 2 === 1,
                id: "lines",
              },
              { match: "*", id: "dots" },
            ]
      }
      id="name"
      value="amount"
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      valueFormat=" >-$,.2f"
      innerRadius={progress ? 0.7 : 0.4}
      padAngle={2}
      cornerRadius={progress ? 2 : 5}
      activeOuterRadiusOffset={10}
      sortByValue={progress ? false : true}
      enableArcLinkLabels={false}
      arcLabelsSkipAngle={15}
      enableArcLabels={true}
      arcLabelsComponent={() => (
        <div className="h-20 w-20 bg-primary-med">
          <IconButton icon={faHouse} />
        </div>
      )}
      tooltip={({ datum: data }) => (
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
