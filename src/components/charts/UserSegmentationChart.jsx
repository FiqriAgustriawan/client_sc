"use client";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UserSegmentationChart = ({ data, height = "280px" }) => {
  // Pastikan data tersedia dan memiliki struktur yang benar
  if (!data || !data.activity || !Array.isArray(data.activity)) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Data segmentasi tidak tersedia</p>
      </div>
    );
  }

  // Ekstrak data aktivitas pengguna dari prop data
  const activityData = data.activity || [];
  
  // Ekstrak labels dan values untuk chart
  const labels = activityData.map(item => item.name || "Tidak diketahui");
  const series = activityData.map(item => item.value || 0);
  
  // Warna yang sesuai dengan keterangan aktivitas pengguna
  const colorMap = {
    'Sangat Aktif': '#10B981', // Hijau - sangat aktif
    'Aktif': '#3B82F6',        // Biru - aktif
    'Sesekali': '#F59E0B',     // Kuning - sesekali
    'Tidak Aktif': '#9CA3AF'   // Abu-abu - tidak aktif
  };
  
  // Generate warna berdasarkan labels/name
  const colors = labels.map(label => colorMap[label] || '#9CA3AF');

  const options = {
    chart: {
      type: "donut",
      animations: {
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
      fontFamily: 'inherit',
    },
    colors: colors,
    labels: labels,
    legend: {
      position: "bottom",
      offsetY: 5,
      fontSize: "13px",
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: true,
            name: { 
              show: true,
              fontSize: '14px',
              fontWeight: 500
            },
            value: { 
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              formatter: function(val) {
                return val;
              }
            },
            total: {
              show: true,
              label: "Total Pengguna",
              fontSize: '14px',
              fontWeight: 600,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function(val) {
          return val + " pengguna";
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: "bottom"
        }
      }
    }],
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.9,
        },
      },
    },
  };

  return (
    <div style={{ height }} className="segmentation-chart">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height="100%"
      />
    </div>
  );
};

export default UserSegmentationChart;