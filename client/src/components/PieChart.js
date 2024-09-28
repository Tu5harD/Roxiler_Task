import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { getPieChartData } from "../services/index";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

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

const PieChartStats = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPieChartData(selectedMonth);
        setPieData(data);
      } catch (err) {
        console.error("Error fetching pie chart data:", err);
        setError("Failed to fetch pie chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [selectedMonth]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4">
      <div className="w-full mb-8 flex gap-5 items-center justify-evenly">
        <h2 className="text-2xl font-semibold mb-4">
          Pie Chart Stats - <span className="text-xl">{selectedMonth}</span>
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
          <div className="text-center py-4">Loading pie chart data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartStats;
