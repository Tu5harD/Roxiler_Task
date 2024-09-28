const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const axios = require("axios");

const getMonthName = (date) => {
  return new Date(date).toLocaleString("default", { month: "long" });
};

const initializeDatabase = async () => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.deleteMany({});

    await Transaction.insertMany(
      transactions.map((t) => ({
        ...t,
        dateOfSale: new Date(t.dateOfSale),
        month: getMonthName(t.dateOfSale),
      }))
    );

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initializeDatabase();

router.get("/transactions", async (req, res) => {
  try {
    const { month, search, page = 1, per_page = 10 } = req.query;

    let query = {};

    if (month) {
      query.month =
        month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: isNaN(parseFloat(search)) ? undefined : parseFloat(search) },
      ].filter(Boolean);
    }

    const skip = (parseInt(page) - 1) * parseInt(per_page);

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(per_page))
      .sort({ dateOfSale: 1 });

    const totalCount = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalCount / per_page);

    res.json({
      transactions,
      totalPages,
      currentPage: parseInt(page),
      perPage: parseInt(per_page),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/statistics/sale-amount", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const result = await Transaction.aggregate([
      {
        $match: {
          month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
          sold: true,
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSaleAmount = result.length > 0 ? result[0].totalAmount : 0;

    res.json({ totalSaleAmount });
  } catch (error) {
    console.error("Error calculating total sale amount:", error);
    res.status(500).json({ error: "Error calculating total sale amount" });
  }
});

router.get("/statistics/sold-item", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const totalSoldItems = await Transaction.countDocuments({
      month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
      sold: true,
    });

    res.json({ totalSoldItems });
  } catch (error) {
    console.error("Error calculating total sold items:", error);
    res.status(500).json({ error: "Error calculating total sold items" });
  }
});

router.get("/statistics/not-sold-item", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const totalNotSoldItems = await Transaction.countDocuments({
      month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
      sold: false,
    });

    res.json({ totalNotSoldItems });
  } catch (error) {
    console.error("Error calculating total not sold items:", error);
    res.status(500).json({ error: "Error calculating total not sold items" });
  }
});

router.get("/bar-chart", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const result = await Transaction.aggregate([
      {
        $match: {
          month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: priceRanges.map(({ min, max }) => ({
                case: {
                  $and: [{ $gte: ["$price", min] }, { $lte: ["$price", max] }],
                },
                then: `${min}-${max === Infinity ? "above" : max}`,
              })),
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedResult = result.map((item) => ({
      range: item._id,
      count: item.count,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Error fetching bar chart data" });
  }
});

router.get("/pie-chart", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const result = await Transaction.aggregate([
      {
        $match: {
          month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
        },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const formattedResult = result.map((item) => ({
      category: item._id,
      count: item.count,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Error fetching pie chart data" });
  }
});

router.get("/combined-data", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const normalizedMonth =
      month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

    const transactionsResponse = await axios.get(
      `http://localhost:${process.env.PORT}/transactions?month=${normalizedMonth}`
    );

    const totalSaleAmountResponse = await axios.get(
      `http://localhost:${process.env.PORT}/statistics/sale-amount?month=${normalizedMonth}`
    );
    const totalSoldItemsResponse = await axios.get(
      `http://localhost:${process.env.PORT}/statistics/sold-item?month=${normalizedMonth}`
    );
    const totalNotSoldItemsResponse = await axios.get(
      `http://localhost:${process.env.PORT}/statistics/not-sold-item?month=${normalizedMonth}`
    );

    const barChartResponse = await axios.get(
      `http://localhost:${process.env.PORT}/bar-chart?month=${normalizedMonth}`
    );

    const pieChartResponse = await axios.get(
      `http://localhost:${process.env.PORT}/pie-chart?month=${normalizedMonth}`
    );

    res.json({
      transactions: transactionsResponse.data,
      totalSale: totalSaleAmountResponse.data.totalSaleAmount,
      totalSoldItems: totalSoldItemsResponse.data.totalSoldItems,
      totalNotSoldItems: totalNotSoldItemsResponse.data.totalNotSoldItems,
      barChartData: barChartResponse.data,
      pieChartData: pieChartResponse.data,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: "Error fetching combined data" });
  }
});
module.exports = router;
