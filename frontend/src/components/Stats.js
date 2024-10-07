import { Statistic, message } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';


export default function Stats({ month, monthText }) {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://pratham-backend.onrender.com/combined-data?month=${month}`);
            setLoading(false);
            setData(res.data);
            message.success('Data loaded successfully');
        } catch (error) {
            console.log(error);
            message.error('Error loading data');
        }
    };

    useEffect(() => {
        getData();
        return () => {
            setData(null);
        };
    }, [month]);

    const containerStyle = {
        padding: '20px',
        background: 'linear-gradient(to right, #fff, #f3f3f3)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.5s ease-in',
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2C3E50',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: '28px',
    };

    const chartsWrapperStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '48px',
        marginBottom: '20px',
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Stats for {monthText}</h2>
            <div style={chartsWrapperStyle}>
                <div style={{ minWidth: '720px' }}>
                    <Totals stats={data?.statsData} loading={loading} />
                    {data && <BarChart data={data?.barChartData} />}
                </div>
                {data && <PieChart data={data?.pieChartData} />}
            </div>
        </div>
    );
}




function Totals({ stats, loading }) {
    const totalsStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '900px',
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
        background: 'linear-gradient(to right, #FDEB71, #F8D800)',
        transition: 'transform 0.3s ease',
    };

    const statisticStyle = {
        textAlign: 'center',
        margin: '0 10px',
        color: '#222',
    };

    const textStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#222',
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 'normal',
        color: '#666',
    };

    return (
        <div style={totalsStyle}>
            <div style={statisticStyle}>
                <motion.h4 style={titleStyle}>Total Sale</motion.h4>
                <motion.div
                    style={textStyle}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <CountUp start={0} end={stats?.totalSale || 0} duration={2.5} separator="," prefix="₹" />
                </motion.div>
            </div>

            <div style={statisticStyle}>
                <motion.h4 style={titleStyle}>Total Sold Items</motion.h4>
                <motion.div
                    style={textStyle}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <CountUp start={0} end={stats?.soldCount || 0} duration={2.5} separator="," />
                </motion.div>
            </div>

            <div style={statisticStyle}>
                <motion.h4 style={titleStyle}>Total Unsold Items</motion.h4>
                <motion.div
                    style={textStyle}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <CountUp start={0} end={stats?.unsoldCount || 0} duration={2.5} separator="," />
                </motion.div>
            </div>
        </div>
    );
}

function BarChart({ data }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333', // Legend color
                    font: { size: 14, family: 'Arial' }, // Font style for the legend
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `Count: ${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Price Range',
                    color: '#444',
                    font: { size: 16, family: 'Arial' },
                },
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Product Count',
                    color: '#444',
                    font: { size: 16, family: 'Arial' },
                },
                ticks: {
                    stepSize: 4,
                    color: '#333', // Tick color for better contrast
                },
            },
        },
        // Adding an animation for the chart rendering
        animation: {
            duration: 1500, // Animation duration
            easing: 'easeOutBounce', // Bounce effect for the chart rendering
        },
    };

    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'No of products per price range',
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.8)', // Bright red background for bars
                borderColor: 'rgba(255, 99, 132, 1)', // Red border
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(255, 159, 64, 0.7)', // Bright orange on hover
            },
        ],
    };

    const chartContainerStyle = {
        margin: '24px 0px',
        maxWidth: '900px',
        maxHeight: '500px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        background: 'linear-gradient(135deg, #f0f0f0, #ffffff)', // Subtle background gradient
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    };

    return (
        <Bar
            data={chartData}
            options={options}
            style={chartContainerStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
}


function PieChart({ data }) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: '# of Products',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    return (
        <Doughnut
            data={chartData}
            style={{ margin: '24px 0px', maxHeight: '400px', maxWidth: '400px', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
        />
    );
}
