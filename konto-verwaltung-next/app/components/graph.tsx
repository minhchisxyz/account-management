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
} from 'chart.js';
import { Line } from "react-chartjs-2";
import { formatEuro, formatVND } from "../lib/formatterService";
import {EuroIcon, VietnamIcon } from "./icons";

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
                    callback: currency === 'VND' ? formatVND : formatEuro
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
        <div className="w-full">
            {currency === 'VND' ? (
                <VietnamIcon />
            ) : currency === 'EUR' ? (
                <EuroIcon />
            ) : null}
            <Line options={options} data={data} />
        </div>
    )
}
