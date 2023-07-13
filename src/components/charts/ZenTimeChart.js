import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ZenTimeChart = ({ averageCompletionTime, closedDates }) => {

    const chartData = {
        labels: closedDates,
        datasets: [
            {
                label: 'Minuti',
                data: averageCompletionTime,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Minuti'
                }
            }
        }
    };


    return <Bar data={chartData} options={chartOptions} />;
};

export default ZenTimeChart;
