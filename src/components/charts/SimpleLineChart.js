import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SimpleLineChart = ({ data, dates, color }) => {

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: '',  // empty string to not show any label
                data: data,
                backgroundColor: 'transparent',  // No fill under the line
                borderColor: color,  // Black line
                borderWidth: 3,
                pointRadius: 0  // No points shown on the line
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false  // Do not display x-axis
            },
            y: {
                display: false  // Do not display y-axis
            }
        },
        plugins: {
            legend: {
                display: false // Do not display legend
            },
            tooltip: {
                enabled: false // Do not show tooltips
            }
        }
    };


    return <Line width={200} height={30} data={chartData} options={chartOptions} />;
};

export default SimpleLineChart;


