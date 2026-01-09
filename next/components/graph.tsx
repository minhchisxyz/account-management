'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  Tick,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import {EuroIcon, VietnamIcon } from "./icons";
import {formatEuro, formatVND} from "@/app/lib/formatterService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph({
  labels, dataset, title, currency
}: {
  labels: string[],
  dataset: number[],
  title: string,
  currency: string
}) {
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: false,

      },
      title: {
        display: true,
        position: 'bottom' as const,
        text: title,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          callback: function (
            this: Scale,
            tickValue: string | number,
            _index: number,
            _ticks: Tick[]
          ): string {
            const num =
              typeof tickValue === 'number'
                ? tickValue
                : Number(tickValue);

            const formatter = currency === 'VND' ? formatVND : formatEuro;
            return formatter(num);
          },
        }
      }
    },
  }
  const data = {
    labels,
    datasets: [
      {
        label: currency,
        data: dataset,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      }
    ],
  };
  return (
    <div className="w-full h-fit">
      {currency === 'VND' ? (
        <VietnamIcon />
      ) : currency === 'EUR' ? (
        <EuroIcon />
      ) : null}
      <Line options={options} data={data} />
    </div>
  )
}

