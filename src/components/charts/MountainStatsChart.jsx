"use client";
import React from "react";
import dynamic from "next/dynamic";
import { chartDefaultOptions } from "./ChartOptions";

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MountainStatsChart = ({ mountainStats, viewMode = "trends", height = "500px" }) => {
  const getChartOptions = () => {
    return {
      ...chartDefaultOptions,
      chart: {
        ...chartDefaultOptions.chart,
        id: "mountain-stats-chart",
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          export: {
            csv: {
              filename: `Statistik-Gunung-${new Date().toLocaleDateString("id")}`,
              headerCategory: "Periode",
              headerValue: "Nilai",
            },
            svg: {
              filename: `Statistik-Gunung-${new Date().toLocaleDateString("id")}`,
            },
            png: {
              filename: `Statistik-Gunung-${new Date().toLocaleDateString("id")}`,
            },
          },
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      colors: [
        "#4F46E5",
        "#10B981",
        "#F59E0B",
        "#EC4899",
        "#06B6D4",
        "#8B5CF6",
      ],
      grid: {
        borderColor: "#E2E8F0",
        strokeDashArray: 2,
        row: {
          colors: ["#F8FAFC", "transparent"],
          opacity: 0.5,
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        type: "category",
        categories: mountainStats.mountainTrends[0]?.monthly_data?.map((d) => d.month) || [],
        title: {
          text: "Periode (Bulan)",
          style: {
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        title: {
          text: viewMode === "revenue" ? "Pendapatan (Rp)" : "Jumlah Pengunjung",
          style: {
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: (value) => {
            if (viewMode === "revenue") {
              return `Rp ${Intl.NumberFormat("id").format(value)}`;
            }
            return value.toFixed(0);
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "light",
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: (value) => {
            if (viewMode === "revenue") {
              return `Rp ${Intl.NumberFormat("id").format(value)}`;
            }
            return `${value} pengunjung`;
          },
        },
        marker: {
          show: true,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
        markers: {
          width: 10,
          height: 10,
          radius: 5,
        },
      },
    };
  };

  const getSeriesData = () => {
    if (!mountainStats.mountainTrends || mountainStats.mountainTrends.length === 0) {
      return [];
    }

    // Limit to top 6 mountains for better visualization
    return viewMode === "revenue" 
      ? mountainStats.mountainTrends.slice(0, 6).map((mountain) => ({
          name: mountain.mountain_name,
          data: mountain.monthly_data.map((d) => d.revenue || 0),
        }))
      : mountainStats.mountainTrends.slice(0, 6).map((mountain) => ({
          name: mountain.mountain_name,
          data: mountain.monthly_data.map((d) => d.trip_count),
        }));
  };

  if (!mountainStats?.mountainTrends || mountainStats.mountainTrends.length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ReactApexChart
        options={getChartOptions()}
        series={getSeriesData()}
        type="area"
        height="100%"
      />
    </div>
  );
};

export default MountainStatsChart;