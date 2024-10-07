const router = require('express').Router();
const axios = require('axios');
const Transaction = require('../models/transactionModel');
require('dotenv').config();
const dataURL = process.env.DATA_URL || '';

// Utility function to generate a month query
const getMonthQuery = (month) => {
    return month === 0 ? {} : {
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, month]
        }
    };
};

// GET API to fetch transaction data by month
router.get('/transactions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const month = !isNaN(parseInt(req.query.month)) ? parseInt(req.query.month) : 3;

        const searchConfig = {
            $and: [
                getMonthQuery(month),
                {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { price: { $regex: search, $options: 'i' } }
                    ]
                }
            ]
        };

        const data = await Transaction.find(searchConfig).skip(skip).limit(limit);
        const totalCount = await Transaction.countDocuments(searchConfig);

        res.status(200).json({
            success: true,
            totalCount,
            page,
            limit,
            month,
            transactions: data
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// GET API for statistics by month
router.get('/statistics', async (req, res) => {
    try {
        const month = !isNaN(parseInt(req.query.month)) ? parseInt(req.query.month) : 3;
        const monthQuery = getMonthQuery(month);

        const projectQuery = {
            _id: 0,
            price: 1,
            sold: 1,
            dateOfSale: 1
        };

        const data = await Transaction.find(monthQuery, projectQuery);
        const response = data.reduce((acc, curr) => {
            const currPrice = parseFloat(curr.price);
            acc.totalSale += curr.sold ? currPrice : 0;
            acc.soldCount += curr.sold ? 1 : 0;
            acc.unsoldCount += curr.sold ? 0 : 1;
            return acc;
        }, { totalCount: data.length, totalSale: 0, soldCount: 0, unsoldCount: 0 });

        response.totalSale = response.totalSale.toFixed(2);
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
});

// GET API to create an API for bar chart
router.get('/bar-chart', async (req, res) => {
    try {
        const month = !isNaN(parseInt(req.query.month)) ? parseInt(req.query.month) : 3;
        const monthQuery = getMonthQuery(month);

        const data = await Transaction.find(monthQuery, { _id: 0, price: 1 });

        const accumulator = Array(9).fill(0).reduce((acc, _, i) => {
            const range = `${i * 100}-${(i + 1) * 100}`;
            acc[range] = 0;
            return acc;
        }, { "901-above": 0 });

        const response = data.reduce((acc, curr) => {
            const currPrice = parseFloat(curr.price);
            let range = Math.ceil(currPrice / 100) * 100;
            range = range > 900 ? '901-above' : `${range - 100}-${range}`;
            acc[range]++;
            return acc;
        }, accumulator);

        res.status(200).json(response);

    } catch (error) {
        console.error("Error generating bar chart data:", error);
        res.status(500).json({ error: "Failed to generate bar chart" });
    }
});

// GET API for pie chart by category
router.get('/pie-chart', async (req, res) => {
    try {
        const month = !isNaN(parseInt(req.query.month)) ? parseInt(req.query.month) : 3;
        const monthQuery = getMonthQuery(month);

        const data = await Transaction.find(monthQuery, { _id: 0, category: 1 });

        const response = data.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json(response);

    } catch (error) {
        console.error("Error generating pie chart data:", error);
        res.status(500).json({ error: "Failed to generate pie chart" });
    }
});

// GET API to fetch combined data from statistics, bar chart, and pie chart
router.get('/combined-data', async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get('host')}`;
        const month = req.query.month;

        const [stats, barChart, pieChart] = await Promise.all([
            axios.get(`${baseURL}/statistics?month=${month}`),
            axios.get(`${baseURL}/bar-chart?month=${month}`),
            axios.get(`${baseURL}/pie-chart?month=${month}`)
        ]);

        res.status(200).json({
            statsData: stats.data,
            barChartData: barChart.data,
            pieChartData: pieChart.data
        });

    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).json({ error: "Failed to fetch combined data" });
    }
});

// Initialize the database with seed data
const initDb = async () => {
    try {
        const { data } = await axios.get(dataURL);
        const docs = await Transaction.insertMany(data);
        if (docs) {
            console.log("Database initialized successfully");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};
initDb();

module.exports = router;
