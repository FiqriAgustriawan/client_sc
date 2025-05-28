"use client";
import React from "react";
import dynamic from "next/dynamic";
import { chartDefaultOptions } from "./ChartOptions";

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UserStatsChart = ({ 
  data, 
  activeUsers,
  viewMode = "registrations", 
  height = "500px" 
}) => {
  // Check if data is available
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  // Create chart options based on current view mode
  const getUserChartOptions = () => {
    return {
      ...chartDefaultOptions,
      chart: {
        ...chartDefaultOptions.chart,
        id: "user-stats-chart",
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
              filename: `Statistik-Pengguna-${new Date().toLocaleDateString("id")}`,
              headerCategory: "Periode",
              headerValue: "Nilai",
            },
            svg: {
              filename: `Statistik-Pengguna-${new Date().toLocaleDateString("id")}`,
            },
            png: {
              filename: `Statistik-Pengguna-${new Date().toLocaleDateString("id")}`,
            },
          },
        },
        colors: ["#8B5CF6", "#EC4899", "#10B981"],
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
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
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
      grid: {
        borderColor: "#E2E8F0",
        strokeDashArray: 2,
        row: {
          colors: ["#F8FAFC", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        type: "category",
        categories: data.map((d) => d.month),
        title: {
          text: "Periode (Bulan)",
          style: {
            fontSize: "14px",
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        title: {
          text: viewMode === "registrations"
            ? "Jumlah Registrasi"
            : viewMode === "activity"
              ? "Jumlah Pengguna Aktif"
              : "Jumlah Pemesanan",
          style: {
            fontSize: "14px",
            fontWeight: 500,
          },
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + " pengguna";
          }
        }
      },
    };
  };

  // Get series data based on view mode
  const getSeriesData = () => {
    switch (viewMode) {
      case "registrations":
        return [
          {
            name: "Pengguna Biasa",
            data: data.map((d) => d.users || 0),
          },
          {
            name: "Guide",
            data: data.map((d) => d.guides || 0),
          },
        ];
      case "activity":
        return [
          {
            name: "Pengguna Aktif",
            data: activeUsers?.map((d) => d.value || 0) || [],
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ height }}>
      <ReactApexChart
        options={getUserChartOptions()}
        series={getSeriesData()}
        type="area"
        height="100%"
      />
    </div>
  );
};

export default UserStatsChart;