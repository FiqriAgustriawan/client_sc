"use client"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Statistik Gunung",
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        bottom: 30,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        color: "#E5E7EB",
        drawTicks: false,
      },
      ticks: {
        padding: 10,
        font: {
          size: 12,
        },
      },
      beginAtZero: true,
      max: 110,
      stepSize: 20,
    },
  },
  maintainAspectRatio: false,
  barThickness: 40,
}

const labels = [
  "Bulu Baria",
  "Latimojong",
  "Bulusaraung",
  "Bulu Bialo",
  "Lompobattang",
  "Bawakaraeng",
  "Lembah Lohe",
  "Lembah ramma",
  "Bukit Sudiang",
]

const data = {
  labels,
  datasets: [
    {
      data: [85, 70, 105, 80, 75, 85, 45, 95, 65],
      backgroundColor: "#3B82F6", // Tailwind blue-500
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}

export default function BarChart() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <div className="h-[400px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

