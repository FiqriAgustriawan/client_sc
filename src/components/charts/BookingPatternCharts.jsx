"use client";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const BookingHoursChart = ({ data, height = "230px" }) => {
  const options = {
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    plotOptions: {
      heatmap: {
        radius: 5,
        enableShades: true,
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 10,
              name: "Rendah",
              color: "#F9FAFB",
            },
            {
              from: 11,
              to: 30,
              name: "Sedang",
              color: "#93C5FD",
            },
            {
              from: 31,
              to: 100,
              name: "Tinggi",
              color: "#3B82F6",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      labels: {
        show: false,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} pemesanan`,
      },
    },
  };

  const series = [
    {
      name: "Pemesanan",
      data: data?.map((h) => ({
        x: `${h.hour_of_day}:00`,
        y: h.count,
      })) || [],
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height="100%"
      />
    </div>
  );
};

export const BookingDaysChart = ({ data, height = "230px" }) => {
  const options = {
    chart: {
      type: "radar",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
        opacity: 0.2,
      },
    },
    colors: ["#8B5CF6"],
    fill: {
      opacity: 0.7,
    },
    markers: {
      size: 4,
      colors: ["#8B5CF6"],
      strokeWidth: 0,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: data?.map((d) => d.day_name) || [],
    },
  };

  const series = [
    {
      name: "Pemesanan",
      data: data?.map((d) => d.count) || [],
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height="100%"
      />
    </div>
  );
};