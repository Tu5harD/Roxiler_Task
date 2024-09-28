import React, { useState, useEffect } from "react";
import { getCombinedData } from "../services/index";

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

const CombinedData = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [combinedData, setCombinedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombinedData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCombinedData(selectedMonth);
        setCombinedData(data);
      } catch (err) {
        console.error("Error fetching combined data:", err);
        setError("Failed to fetch combined data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
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
          <div className="text-center py-4">Loading combined data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <pre className="bg-gray-50 border border-gray-300 p-4 rounded overflow-auto">
              {JSON.stringify(combinedData.transactions, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold">Total Sale Amount</h2>
            <p className="bg-gray-50 border border-gray-300 p-4 rounded">
              {combinedData.totalSale}
            </p>

            <h2 className="text-xl font-semibold">Total Sold Items</h2>
            <p className="bg-gray-50 border border-gray-300 p-4 rounded">
              {combinedData.totalSoldItems}
            </p>

            <h2 className="text-xl font-semibold">Total Not Sold Items</h2>
            <p className="bg-gray-50 border border-gray-300 p-4 rounded">
              {combinedData.totalNotSoldItems}
            </p>

            <h2 className="text-xl font-semibold">Bar Chart Data</h2>
            <pre className="bg-gray-50 border border-gray-300 p-4 rounded overflow-auto">
              {JSON.stringify(combinedData.barChartData, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold">Pie Chart Data</h2>
            <pre className="bg-gray-50 border border-gray-300 p-4 rounded overflow-auto">
              {JSON.stringify(combinedData.pieChartData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedData;
