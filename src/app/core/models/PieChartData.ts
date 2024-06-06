export interface PieChartValue {
    name: string;
    value: number;
}

export interface PieChartData {
    name: string;
    series: PieChartValue[];
  }