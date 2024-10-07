// Transactions.js
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table, Input, message, Image, Button } from 'antd';
import axios from 'axios';

const { Search } = Input;

const Transactions = ({ month, monthText }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Default to page 1
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState(""); // For search functionality
    const productsPerPage = 10; // Items to show per page

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            width: "40px",
            align: "center",
            render: (text, record, index) => index + 1 + (currentPage - 1) * productsPerPage,
            style: { fontWeight: 'bold' }
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "200px",
            style: { fontWeight: '500' }
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: "80px",
            align: "center",
            render: (price) => <span style={{ color: '#3D9970' }}>${parseFloat(price).toFixed(2)}</span>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (desc) => <span style={{ color: '#555' }}>{desc}</span>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: "120px",
            style: { fontStyle: 'italic', color: '#6B7280' }
        },
        {
            title: "Sold",
            dataIndex: "sold",
            key: "sold",
            width: "50px",
            align: "center",
            render: (sold) => <span style={{ color: sold ? '#2ECC71' : '#FF4136' }}>{sold ? "Yes" : "No"}</span>
        },
        {
            title: "Date",
            dataIndex: "dateOfSale",
            key: "dateOfSale",
            width: "100px",
            align: "center",
            render: (date) => moment(date).format("DD MMM YYYY"),
            style: { fontSize: '12px', fontWeight: 'lighter' }
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: "80px",
            align: "center",
            render: (url) => <Image src={url} alt="Product" width={50} style={{ borderRadius: '5px' }} />
        }
    ];

    const getData = async (page) => {
        try {
            setLoading(true);
            const { data: responseData } = await axios.get(`http://localhost:5000/transactions`, {
                params: {
                    month,
                    page, // Current page number
                    limit: productsPerPage // Limit to the number of products per page
                }
            });

            setData(responseData.transactions);
            setTotalCount(responseData.totalCount); // Total count for pagination
            setLoading(false);
            message.success('Data loaded successfully');
        } catch (error) {
            console.log(error);
            message.error('Error loading data');
            setLoading(false);
        }
    };

    useEffect(() => {
        getData(currentPage); // Fetch data for the current page whenever it changes
    }, [currentPage, month]);

    const handleSearch = async (value) => {
        setSearchTerm(value); // Update the search term
        setCurrentPage(1); // Reset to the first page

        try {
            setLoading(true);
            const { data: responseData } = await axios.get(`http://localhost:5000/transactions`, {
                params: {
                    month,
                    page: 1, // Always reset to page 1 on search
                    limit: productsPerPage,
                    search: value // Search term to the API
                }
            });

            setData(responseData.transactions);
            setTotalCount(responseData.totalCount); // Total count for pagination
            setLoading(false);
            message.success('Search completed successfully');
        } catch (error) {
            console.log(error);
            message.error('Error searching data');
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentPage * productsPerPage < totalCount) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Transactions for {monthText}</h2>
            
            <Search
                placeholder="Search by Title or Description"
                allowClear
                onSearch={handleSearch}
                style={{
                    width: 300,
                    marginBottom: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '8px',
                    fontSize: '16px'
                }}
            />

            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={false} // Disable default pagination
                loading={loading}
                size='middle'
                bordered
                scroll={{ y: 540 }}
                style={{ backgroundColor: '#fff', borderRadius: '8px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button 
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{ backgroundColor: currentPage === 1 ? '#ccc' : '#F59E0B', color: '#ffffff', border: 'none', borderRadius: '5px' }}
                >
                    Previous
                </Button>
                <Button 
                    onClick={handleNext}
                    disabled={currentPage * productsPerPage >= totalCount}
                    style={{ backgroundColor: currentPage * productsPerPage >= totalCount ? '#ccc' : '#F59E0B', color: '#ffffff', border: 'none', borderRadius: '5px' }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Transactions;
