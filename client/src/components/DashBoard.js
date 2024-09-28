import React, { useState, useEffect } from "react";
import { getTransactions } from "../services";

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

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(month, search, page);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <section className="container px-4 mx-auto py-2">
      <div className="flex items-center justify-between gap-x-3">
        <div className="flex w-full flex-row gap-2 items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="block mt-2 w-60 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-yellow-50  px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            value={search}
            onChange={handleSearchChange}
          />

          <select
            className="block mt-2 w-60 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-yellow-50 px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            value={month}
            onChange={handleMonthChange}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-300 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-yellow-400 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3.5 text-sm font-normal text-center dark:text-gray-400 w-16">
                      ID
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-normal dark:text-gray-400 w-1/4">
                      Title
                    </th>
                    <th className="px-4 py-3.5 text-sm text-center font-normal dark:text-gray-400 w-1/3">
                      Description
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-normal tdark:text-gray-400 w-24">
                      Price
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-normal dark:text-gray-400 w-24">
                      Category
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-normal dark:text-gray-400 w-20">
                      Sold
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-normal  dark:text-gray-400 w-24">
                      Image
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-yellow-100 divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-4 text-sm  dark:text-gray-300">
                        {transaction.title}
                      </td>
                      <td className="px-4 py-4 text-sm  dark:text-gray-300">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-4 text-center text-sm dark:text-gray-300 whitespace-nowrap">
                        Rs.
                        {transaction.price
                          ? transaction.price.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-4 py-4 text-center text-sm dark:text-gray-300 whitespace-nowrap">
                        {transaction.category}
                      </td>
                      <td className="px-4 py-4 text-center text-sm dark:text-gray-300 whitespace-nowrap">
                        {transaction.sold ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-medium twhitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <img
                            src={transaction.image}
                            alt={transaction.title}
                            className="w-16 h-16 object-cover"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          className="flex cursor-pointer items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>

          <span>Previous</span>
        </button>

        <div className="items-center hidden md:flex gap-x-3">
          <span className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">
            Page {page} of {totalPages}
          </span>
        </div>

        <button
          className="flex cursor-pointer items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <span>Next</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default DashBoard;
