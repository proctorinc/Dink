import { type FC } from "react";

type PieChartProps = {
  data: unknown[];
  progress?: boolean;
};

export const PieChart: FC<PieChartProps> = ({ data, progress }) => {
  const theme = {
    fontSize: 15,
  };

  return (
    <></>
    // <ResponsivePie
    //   theme={theme}
    //   data={data}
    //   colors={
    //     progress ? ["#00C6C5", "#3D3F71"] : ["#3D3F71", "#00C6C5", "#167B8D"]
    //   }
    //   id="name"
    //   value="amount"
    //   margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    //   valueFormat=" >-$,.2f"
    //   innerRadius={progress ? 0.7 : 0.5}
    //   padAngle={progress ? 1 : 1}
    //   cornerRadius={progress ? 2 : 5}
    //   activeOuterRadiusOffset={10}
    //   sortByValue={progress ? false : true}
    //   enableArcLinkLabels={false}
    //   arcLabelsSkipAngle={15}
    //   arcLabelsTextColor="#FFF"
    //   arcLabel="id"
    //   enableArcLabels={false}
    //   tooltip={({ datum: data }) => (
    //     <div className="flex w-fit items-center gap-2 rounded-xl bg-primary-med px-3 py-1 font-bold shadow-2xl">
    //       <div
    //         style={{ backgroundColor: data.color }}
    //         className="aspect-square h-6 rounded-sm border-2 border-primary-light"
    //       />
    //       <div className="flex flex-col">
    //         <span>{data.id}</span>
    //         <span className="text-primary-light">{data.formattedValue}</span>
    //       </div>
    //     </div>
    //   )}
    // />
  );
};
