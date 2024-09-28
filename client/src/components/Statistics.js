import React, { useState, useEffect } from "react";
import {
  getTotalSaleAmount,
  getTotalSoldItems,
  getTotalNotSoldItems,
} from "../services/index";

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

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    notSoldItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [totalSaleAmount, soldItems, notSoldItems] = await Promise.all([
          getTotalSaleAmount(selectedMonth),
          getTotalSoldItems(selectedMonth),
          getTotalNotSoldItems(selectedMonth),
        ]);
        setStats({ totalSaleAmount, soldItems, notSoldItems });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4">
      <div className="w-full mb-8 flex gap-5 items-center justify-evenly">
        <h2 className="text-2xl font-semibold mb-4">
          Statistics - <span className="text-xl">{selectedMonth}</span>
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
      <div className="w-full bg-white rounded-sm px-2 py-5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-yellow-400 dark:bg-gray-800">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-white">
                Statistic
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-white">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-yellow-100">
            <tr className="border-b  dark:border-gray-700">
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                Total sale
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                Rs.{stats.totalSaleAmount.toLocaleString()}
              </td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                Total sold items
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                {stats.soldItems}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                Total not sold items
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                {stats.notSoldItems}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {loading && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading statistics...
        </p>
      )}
      {error && <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Statistics;
