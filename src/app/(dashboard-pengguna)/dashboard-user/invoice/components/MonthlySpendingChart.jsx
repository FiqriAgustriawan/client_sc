"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlySpendingChart = ({ data }) => {
  // Format currency in Indonesian Rupiah
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Check if there's any spending data
  const hasData = data.some((item) => item.amount > 0);

  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Belum ada data pengeluaran bulanan.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          fontSize={11}
        />
        <YAxis
          tickFormatter={(value) => `Rp${value / 1000}k`}
          axisLine={false}
          tickLine={false}
          fontSize={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="amount"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlySpendingChart;
