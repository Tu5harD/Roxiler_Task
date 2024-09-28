import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getBarChartData } from "../services/index";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BarChartStatistic = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBarChartData(selectedMonth);
        setChartData(data);
      } catch (err) {
        console.error("Error fetching bar chart data:", err);
        setError("Failed to fetch bar chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4">
      <div className="w-full mb-8 flex gap-5 items-center justify-evenly">
        <h2 className="text-2xl font-semibold mb-4">
          Bar Chart Stats - <span className="text-xl">{selectedMonth}</span>
        </h2>
        <select
          className="w-full sm:w-60 text-base placeholder-gray-400/70 rounded-sm border border-gray-200 bg-yellow-100 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full bg-white rounded-sm border border-gray-400 px-2 py-5">
        {loading ? (
          <div className="text-center py-4">Loading bar chart data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4DD0E1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChartStatistic;
