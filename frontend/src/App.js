import './App.css';
import React, { useState } from 'react';
import { Layout, Menu, Select, Button } from 'antd';
import Transactions from './components/Transactions';
import Stats from './components/Stats';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const navItems = [
  {
    key: 1,
    label: (<NavLink to="/" style={{ fontSize: "18px", color: "#ffffff" }}>Transactions</NavLink>)
  },
  {
    key: 2,
    label: (<NavLink to="/stats" style={{ fontSize: "18px", color: "#ffffff" }}>Stats</NavLink>)
  }
];

const options = [
  "All Months",
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
  "December"
];

const App = () => {
  let [month, setMonth] = useState(3); // Default to March

  const handleMonthChange = (value) => {
    setMonth(parseInt(value));
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => {
      const nextMonth = (prevMonth + 1) % options.length;
      handleMonthChange(nextMonth); // Sync with the dropdown
      return nextMonth;
    });
  };

  const handlePreviousMonth = () => {
    setMonth((prevMonth) => {
      const previousMonth = (prevMonth - 1 + options.length) % options.length;
      handleMonthChange(previousMonth); // Sync with the dropdown
      return previousMonth;
    });
  };

  return (
    <BrowserRouter>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1F2937",
            padding: "0 40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            animation: "fade-in 1s ease-in-out",
          }}
        >
          <h1 style={{
            color: "#F59E0B",
            fontWeight: "bold",
            fontSize: "24px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            animation: "pulse 2s infinite",
          }}>
            Dashboard
          </h1>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={navItems}
            style={{
              flex: 1,
              padding: "0 60px",
              justifyContent: "center",
              backgroundColor: "transparent"
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={handlePreviousMonth}
              style={{ marginRight: '8px', backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#ffffff' }}
            >
              Previous
            </Button>
            <Select
              size="large"
              value={options[month]}
              onChange={handleMonthChange}
              style={{
                width: 200,
                fontWeight: "bold",
                color: "#ffffff",
                backgroundColor: "#374151", // Dark background for the select
                borderColor: "#F59E0B", // Orange border color
                borderRadius: "8px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                padding: "8px",
              }}
              dropdownStyle={{
                backgroundColor: "#F59E0B", // Dark background for dropdown
                color: "#ffffff", // White text for dropdown
              }}
              options={options.map((text, i) => {
                return {
                  value: i,
                  label: text
                };
              })}
              // Custom styles for each option
              optionLabelProp="label"
            />
            <Button 
              onClick={handleNextMonth}
              style={{ marginLeft: '8px', backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#ffffff' }}
            >
              Next
            </Button>
          </div>
        </Header>
        <Content
          style={{
            padding: "20px 48px",
            backgroundColor: "#ffffff",
            minHeight: 600,
            animation: "slide-in 0.8s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >
          <Routes>
            <Route path="/" element={
              <Transactions month={month} monthText={options[month]} />
            } />
            <Route path="/stats" element={
              <Stats month={month} monthText={options[month]} />
            } />
          </Routes>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#1F2937",
            color: "#D1D5DB",
            padding: "10px 20px",
            fontWeight: "500",
            fontSize: "16px",
            letterSpacing: "1px",
            borderTop: "1px solid #374151",
            animation: "fade-in 1s ease-in-out",
          }}
        >
          Created by <strong style={{ color: "#F59E0B" }}>Prathamesh Walvekar</strong>
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
