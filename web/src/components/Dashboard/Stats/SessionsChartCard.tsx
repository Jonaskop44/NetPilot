import React, { FC, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { HourlySessionDto } from "@/api/openapi.schemas";

interface SessionsChartCardProps {
  data: HourlySessionDto[];
}

const SessionsChartCard: FC<SessionsChartCardProps> = ({ data }) => {
  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: "area",
        backgroundColor: "transparent",
        height: 300,
      },
      title: {
        text: undefined,
      },
      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%H:%M}",
        },
        title: {
          text: "Uhrzeit",
        },
      },
      yAxis: {
        title: {
          text: "Anzahl Sessions",
        },
        min: 0,
        allowDecimals: false,
      },
      tooltip: {
        formatter: function () {
          return `<b>${Highcharts.dateFormat("%H:%M", this.x as number)}</b><br/>Sessions: ${this.y}`;
        },
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, "rgba(59, 130, 246, 0.5)"],
              [1, "rgba(59, 130, 246, 0)"],
            ],
          },
          marker: {
            radius: 3,
          },
          lineWidth: 2,
          lineColor: "rgb(59, 130, 246)",
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          type: "area",
          name: "Sessions",
          data: data.map((item) => ({
            x: new Date(item.time).getTime(),
            y: item.count,
          })),
        },
      ],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
    }),
    [data]
  );

  const totalSessions = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data]
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="p-2 rounded-lg bg-primary-100">
          <Icon
            icon="solar:chart-bold-duotone"
            width={24}
            className="text-primary"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-md font-semibold">Session Aktivität</p>
          <p className="text-small text-default-500">
            Heute: {totalSessions} Sessions
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </CardBody>
    </Card>
  );
};

export default SessionsChartCard;
