"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#6366F1",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
];

const SpendingChart = ({ data }) => {
  // Filter out categories with zero amount and limit to top 8
  const chartData = data
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Belum ada data pengeluaran.</p>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Format currency in Indonesian Rupiah
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const customLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
          <p className="font-medium">{data.category}</p>
          <p className="text-blue-600">{formatCurrency(data.amount)}</p>
          <p className="text-gray-500 text-sm">{`${(
            (data.amount / total) *
            100
          ).toFixed(1)}% dari total`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegendText = (value) => {
    // Check if value is a string and handle null/undefined values
    if (typeof value !== "string") {
      return String(value || "");
    }
    // Truncate long mountain names
    return value.length > 15 ? value.substring(0, 12) + "..." : value;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={customLabel}
          outerRadius="80%"
          innerRadius="40%"
          fill="#8884d8"
          dataKey="amount"
          nameKey="category"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={renderLegendText}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "10px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SpendingChart;
