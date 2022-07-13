import * as React from "react";

import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle
} from "@progress/kendo-react-charts";

// const series = [
// 	{ jobName: '0-14', allocated: 0.2545 },
// 	{ category: '15-24', value: 0.1552 },
// 	{ category: '25-54', value: 0.4059 },
// 	{ category: '55-64', value: 0.0911 },
// 	{ category: '65+', value: 0.0933 },
// ];

const labelContent = (props: any) => {
  return `${props.category} (${(props.percentage * 100).toFixed(2)}%)`;
};

export const PieChart = ({ series, title }: { series: any; title: string }) => (
  //@ts-ignore
  <Chart style={{ width: 600, height: 1000 }}>
    <ChartTitle text={`${title}'s Worked Hours`} />
    <ChartLegend position="bottom" />
    <ChartSeries>
      <ChartSeriesItem
        type="pie"
        data={series}
        field="worked"
        categoryField="jobName"
        labels={{ visible: true, content: labelContent }}
      />
    </ChartSeries>
  </Chart>
);
