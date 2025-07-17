'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // Add BarController to fix "bar" controller not registered error
  Title,
  Tooltip,
  Legend,
);

interface MonthlyStatsChartProps {
  monthlyStats: {
    month: number;
    count: number;
    revenue: number;
  }[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlyStatsChart({ monthlyStats }: MonthlyStatsChartProps) {
  const chartRef = useRef<ChartJS>(null);

  // Prepare data for the chart
  const labels = MONTHS;
  
  // Map the monthly stats to the correct month index
  const bookingCounts = Array(12).fill(0);
  const revenueData = Array(12).fill(0);
  
  monthlyStats.forEach((stat) => {
    const monthIndex = stat.month - 1; // Convert 1-based month to 0-based index
    if (monthIndex >= 0 && monthIndex < 12) {
      bookingCounts[monthIndex] = stat.count;
      revenueData[monthIndex] = stat.revenue;
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Bookings',
        data: bookingCounts,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Revenue (₹)',
        data: revenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Bookings',
        },
        ticks: {
          precision: 0,
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue (₹)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Bookings & Revenue',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[400px]">
      <Chart type='bar' ref={chartRef} data={data} options={options} />
    </div>
  );
}