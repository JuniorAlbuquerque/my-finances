import { useMemo, type FunctionComponent } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { montserrat } from "~/pages/_app";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { formatCurrency } from "~/utils/formatCurrency";
import { api } from "~/utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = montserrat.style.fontFamily;

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          family: "var(--body-font)",
        },
      },
    },
    title: {
      display: true,
      text: "Quadro geral 2023",
    },
  },
};

const pieData = {
  labels: ["Nubank", "Amex", "Home", "Cellphone", "Transport"],
  datasets: [
    {
      label: "Gasto:",
      data: [2500, 3500, 2000, 45, 350],
      backgroundColor: [
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(153, 102, 255, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
      borderRadius: 6,
      spacing: 10,
      weight: 10,
    },
  ],
};

export const Report: FunctionComponent = () => {
  const { data: reportData } = api.report.getLastMonthInfo.useQuery();
  const { data: monthReport } = api.report.groupByMonth.useQuery();

  const dataLables = useMemo(() => {
    const months = {
      8: "Agosto",
      9: "Setembro",
      10: "Outubro",
      11: "Novembro",
      12: "Dezembro",
    };

    return Object.keys(monthReport!).map(
      (key) => months[parseInt(key) as keyof typeof months]!
    );
  }, [monthReport]);

  const chartMonthData = useMemo(() => {
    return {
      labels: dataLables,
      datasets: [
        {
          label: "Entradas",
          data: Object.values(monthReport!)?.map((item) => item.entries),
          backgroundColor: "#19C964",
          borderRadius: 8,
        },
        {
          label: "Saídas",
          data: Object.values(monthReport!)?.map((item) => item.expenses),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderRadius: 8,
        },
      ],
    };
  }, [dataLables, monthReport]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <Card className="h-full p-4">
          <CardHeader>
            <p className="text-tiny font-bold uppercase text-default-500">
              Último mês
            </p>
          </CardHeader>
          <CardBody className="flex flex-col justify-center gap-2 p-3">
            <div className="mt-4 flex items-center justify-between gap-4 text-medium">
              <p>Entradas</p>
              <div className="h-0.5 w-full bg-success"></div>
              <p className="font-medium text-success">
                {reportData?.entries ?? 0}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 text-medium">
              <p className="pr-5">Saídas</p>
              <div className="h-0.5 w-full bg-danger"></div>
              <p className="font-medium text-danger">{reportData?.expenses}</p>
            </div>

            <Divider />

            <div className="ml-auto flex gap-4">
              <p className="mt-1">Saldo:</p>
              <p className="text-2xl font-medium text-danger">
                {reportData?.balance}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 place-items-center items-center gap-4 rounded-xl bg-zinc-400/10 p-4 md:grid-cols-3">
              <div>
                <span className="text-tiny text-default-500">Diário</span>
                <p>{formatCurrency(reportData?.expensePerDay!, true)}</p>
              </div>

              <div>
                <span className="text-tiny text-default-500">Semanal</span>
                <p>{formatCurrency(reportData?.expensePerWeek!, true)}</p>
              </div>

              <div className="">
                <span className="text-tiny text-default-500">Mensal</span>
                <p>{formatCurrency(reportData?.expenses!, true)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card fullWidth className="flex max-h-96">
        <CardBody className="flex items-center justify-center">
          <Doughnut
            data={pieData}
            options={{
              cutout: "55%",
              responsive: true,
              plugins: {
                legend: {
                  fullSize: true,
                  position: "top",
                  labels: {
                    font: {
                      size: 12,
                    },
                  },
                },
                title: {
                  display: true,
                  text: "Gastos por categoria",
                },
              },
            }}
          />
        </CardBody>
      </Card>

      <Card fullWidth className="md:col-span-2">
        <CardBody className="h-full w-full">
          <Bar options={options} data={chartMonthData} />
        </CardBody>
      </Card>
    </div>
  );
};
