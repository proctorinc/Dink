import { type FC } from "react";
import { ResponsivePie } from "@nivo/pie";
import { IconButton } from "../Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

type PieChartProps = {
  data: unknown[];
  progress?: boolean;
  floatRight?: boolean;
  colors?: string[];
};

export const PieChart: FC<PieChartProps> = ({
  data,
  colors,
  progress,
  floatRight,
}) => {
  const theme = {
    fontSize: 15,
  };

  return (
    <ResponsivePie
      theme={theme}
      data={data}
      colors={colors ?? []}
      id="name"
      value="amount"
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      valueFormat=" >-$,.2f"
      innerRadius={progress ? 0.7 : 0.9}
      padAngle={2}
      cornerRadius={progress ? 2 : 5}
      activeOuterRadiusOffset={10}
      sortByValue={false}
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
          } z-50 flex w-fit translate-y-8 items-center gap-2 rounded-xl bg-primary-med px-3 py-1 font-bold text-white shadow-2xl`}
          style={{ backgroundColor: data.color }}
        >
          <div className="flex flex-col">
            <span>{data.id}</span>
            <span className="font-normal">{data.formattedValue}</span>
          </div>
        </div>
      )}
    />
  );
};
