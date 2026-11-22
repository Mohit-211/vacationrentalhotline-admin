/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "@ant-design/plots";
import "./Dashboard.css";
import { Select, Spin, Table } from "antd";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Flag from "react-world-flags";
import {
	GetContactUsFormCount,
	GetPropertyCountByCountry,
	GetPropertyRegisteredStatistics,
	GetTopPropertyOwner,
	GetTotalpropertyData,
	GetTotalRevenue,
	GetTransactionHistory,
	GetUserCount,
	GetUserRegisteredStatistics,
} from "../../services/Api/DashboardApi";
const { Option } = Select;

const Dashboard = () => {
	const navigate = useNavigate();
	const [customerData, setCustomerData] = useState([]);
	const [contactUsData, setContactUsData] = useState([]);
	const [propertyData, setPropertyData] = useState([]);
	const [revenueData, setRevenueData] = useState([]);
	const [salesCount, setSalesCount] = useState([]);
	const [propertyOwner, setPropertyOwner] = useState([]);
	const [propertyCountByCountryData, setPropertyCountByCountryData] = useState(
		[]
	);
	const [period, setPeriod] = useState("today");
	const [propertyCount, setPropertyCount] = useState([]);
	const [propertyPeriod, setPropertyPeriod] = useState("today");
	const [loading, setLoading] = useState(true);

	const [transactionPeriod, setTransactionPeriod] = useState("today");
	const [transactions, setTransactions] = useState([]);

	const countryCodeMap = {
		Canada: "CA",
		"United States": "US",
		// Add more country mappings as needed
	};

	//get customer count
	const getCustomerData = async () => {
		try {
			const result = await GetUserCount(localStorage.getItem("adminToken"));
			setCustomerData(result.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const getPropertyData = async () => {
		try {
			const result = await GetTotalpropertyData(
				localStorage.getItem("adminToken")
			);
			setPropertyData(result.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const getContactUsData = async () => {
		try {
			const result = await GetContactUsFormCount(
				localStorage.getItem("adminToken")
			);
			setContactUsData(result.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const getTotalRevnueGenerated = async () => {
		try {
			const result = await GetTotalRevenue(localStorage.getItem("adminToken"));
			setRevenueData(result.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const getPropertyOwnerData = async () => {
		try {
			setLoading(true);
			let result = await GetTopPropertyOwner(
				localStorage.getItem("adminToken")
			);

			setPropertyOwner(result.data.data);
		} catch (e) {
			console.log(e);
			if (e.response && e.response.status === 401) {
				navigate("/error401");
				console.log("You do not have access to this page as a sub-admin.");
			} else {
				console.log("Error loading data. Please try again later.");
			}
		} finally {
			setLoading(false);
		}
	};

	const getPropertyCountByCountryData = async () => {
		try {
			const result = await GetPropertyCountByCountry(
				localStorage.getItem("adminToken")
			);
			setPropertyCountByCountryData(result.data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handlePeriodChange = async (newPeriod) => {
		setPeriod(newPeriod); // Update the period state
		try {
			const result = await GetUserRegisteredStatistics(newPeriod); // Call the API
			setSalesCount(result.data.data || 0); // Update sales count with the result data
		} catch (e) {
			console.log(e);
		}
	};

	const handlePropertyPeriodChange = async (newPeriod) => {
		setPropertyPeriod(newPeriod); // Update the period state
		try {
			const result = await GetPropertyRegisteredStatistics(newPeriod); // Call the API
			setPropertyCount(result.data.data || 0); // Update sales count with the result data
		} catch (e) {
			console.log(e);
		}
	};

	const handleTransactionChange = async (newPeriod) => {
		setTransactionPeriod(newPeriod); // Update the period state
		try {
			const result = await GetTransactionHistory(newPeriod); // Call the API
			const data = result.data.data.data || [];

			// Ensure the data includes both totalCount and totalAmount
			const formattedData = data.map((transaction) => ({
				type: transaction.type, // Period (e.g., "1 month", "3 months")
				totalAmount: transaction.totalAmount, // Total revenue for the period
				totalCount: transaction.totalCount, // Total count of transactions
			}));

			setTransactions(formattedData); // Set the data into the state
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		handlePeriodChange(period);
		handlePropertyPeriodChange(propertyPeriod);
		handleTransactionChange(transactionPeriod); /// Fetch data for the default period when the component loads
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true); // Start loading
			await Promise.all([
				getCustomerData(),
				getContactUsData(),
				getPropertyData(),
				getTotalRevnueGenerated(),
				getPropertyOwnerData(),
				getPropertyCountByCountryData(),
			]);
			setLoading(false); // Stop loading once all data is fetched
		};
		fetchData();
	}, []);

	const config = {
		data: [{ type: period, sales: salesCount }],
		xField: "type",
		yField: "sales",
		color: "#4CAF50",
		columnWidthRatio: 0.2, // Adjust column width (0.6 is an example; adjust as needed)
		label: {
			position: "middle",
			style: {
				fill: "#FFFFFF",
				opacity: 1,
			},
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: false,
			},
		},
		yAxis: {
			min: 0, // Start the y-axis from 0
			max: 50, // End the y-axis at 50 or adjust based on your data
			tickInterval: 10, // Set interval to display ticks as 10, 20, 30, etc.
			label: {
				formatter: (v) => `${v}`, // Format y-axis labels as numbers
			},
		},
		meta: {
			type: {
				alias: "Period", // Label for the x-axis
			},
			sales: {
				alias: "Number of Registered Users", // Label for the y-axis
			},
		},
	};

	const propertyConfig = {
		data: [{ type: period, sales: propertyCount }],
		xField: "type",
		yField: "sales",
		color: "#4CAF50",
		columnWidthRatio: 0.2, // Adjust column width (0.6 is an example; adjust as needed)
		label: {
			position: "middle",
			style: {
				fill: "#FFFFFF",
				opacity: 1,
			},
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: false,
			},
		},
		yAxis: {
			min: 0, // Start the y-axis from 0
			max: 50, // End the y-axis at 50 or adjust based on your data
			tickInterval: 10, // Set interval to display ticks as 10, 20, 30, etc.
			label: {
				formatter: (v) => `${v}`, // Format y-axis labels as numbers
			},
		},
		meta: {
			type: {
				alias: "Period", // Label for the x-axis
			},
			sales: {
				alias: "Properties Registered", // Label for the y-axis
			},
		},
	};

	const columnsTopPropertyOwner = [
		{
			title: "User Name",
			dataIndex: "profile_name",
			key: "name",
			width: "20%",
		},
		{
			title: "Property Count",
			dataIndex: "total_properties",
			key: "total_properties",
			width: "20%",
		},
	];

	const transactionsConfig = {
		data: transactions.length > 0
			? transactions.map((transaction) => ({
				type: transaction.type, 
				totalAmount: transaction.totalAmount, 
				totalCount: transaction.totalCount, 
			}))
			: [],
		xField: "type",  
		color: "#4CAF50",
		columnWidthRatio: 0.2,
		label: {
			position: "middle",
			style: {
				fill: "#FFFFFF",
				opacity: 1,
			},
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: false,
			},
			title: {
				text: "Period", 
				style: { fontSize: 14 },
			},
		},
		yAxis: {
			min: 1000, 
			max: 100000, 
			tickInterval: 10000, // Interval between ticks (e.g., every 10,000 USD)
			label: {
				formatter: (v) => `${v} USD`, // Format Y-axis labels to show "USD"
			},
			title: {
				text: "Revenue (USD)", // Title for Y-axis (Revenue)
				style: { fontSize: 14 },
			},
		},
		meta: {
			type: {
				alias: "Period", // Alias for period (x-axis)
			},
			totalAmount: {
				alias: "Revenue", // Alias for sales/revenue (y-axis)
			},
		},
		// Add a second series for totalCount if you want it as a separate visual element
		seriesField: "type",
		series: [
			{
				name: "Total Amount",
				yField: "totalAmount",
				color: "#4CAF50",
			},
			{
				name: "Total Count",
				yField: "totalCount",
				color: "#FF9800", // Different color for totalCount
			}
		],
	};
	

	// If loading, show the spinner overlay
	if (loading) {
		return (
			<div className="spinner-overlay">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "column",
					backgroundColor: "white", // Changed to camelCase
					padding: "20px",
					borderRadius: "8px", // Changed to camelCase
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
					marginBottom: "20px", // Keep quotes for string values
				}}
			>
				<h3 className="dashboard_title">Welcome Admin 👋🏻</h3>
				<p className="page-sub-title" style={{ color: "green" }}>
					Here’s a snapshot of your latest statistics and insights to help you
					manage the platform effectively.
				</p>
			</div>

			{/* first row */}
			<div className="d-flex flex-row gap-3 mb-3">
				<div className="card-box small-card">
					<div>
						<p className="desc">Total Users Registered</p>
						<h4 className="mb-0 sub-title">{customerData}</h4>
					</div>
					<Button
						label="	View Users"
						icon="pi pi-arrow-right"
						iconPos="right"
						style={{
							backgroundColor: "#EFF5FB",
							marginTop: "10px",
							border: "#EFF5FB",
							color: "black",
							borderRadius: "10px",
							fontSize: "13px",
							textAlign: "left",
							transition: "background-color 0.3s ease",
						}}
						onClick={() => navigate("/users")}
						onMouseOver={(e) => {
							e.target.style.backgroundColor = "#D7E8F8";
							e.target.style.color = "#black";
						}}
						onMouseOut={(e) => {
							e.target.style.backgroundColor = "#EFF5FB";
							e.target.style.color = "#black";
						}}
					></Button>
				</div>
				<div className="card-box small-card">
					<div>
						<p className="desc">Number of Contact Us Forms Received</p>
						<h4 className="mb-0 sub-title">{contactUsData}</h4>
					</div>
					<Button
						label="	View Forms"
						icon="pi pi-arrow-right"
						iconPos="right"
						style={{
							backgroundColor: "#E8F7F0",
							marginTop: "10px",
							border: "#E8F7F0",
							color: "black",
							borderRadius: "10px",
							fontSize: "13px",
							textAlign: "left",
							transition: "background-color 0.3s ease",
						}}
						onClick={() => navigate("/professionals")}
						onMouseOver={(e) => {
							e.target.style.backgroundColor = "#CDE7DB";
							e.target.style.color = "#black";
						}}
						onMouseOut={(e) => {
							e.target.style.backgroundColor = "#E8F7F0";
							e.target.style.color = "#black";
						}}
					></Button>
				</div>
				<div className="card-box small-card">
					<div>
						<p className="desc"> Number of Properties</p>
						<h4 className="mb-0 sub-title">{propertyData}</h4>
					</div>
					<Button
						label="	View Properties"
						icon="pi pi-arrow-right"
						iconPos="right"
						style={{
							backgroundColor: "#EFF5FB",
							marginTop: "10px",
							border: "#EFF5FB",
							color: "black",
							borderRadius: "10px",
							fontSize: "13px",
							textAlign: "left",
							transition: "background-color 0.3s ease",
						}}
						onClick={() => navigate("/properties")}
						onMouseOver={(e) => {
							e.target.style.backgroundColor = "#D7E8F8";
							e.target.style.color = "#black";
						}}
						onMouseOut={(e) => {
							e.target.style.backgroundColor = "#EFF5FB";
							e.target.style.color = "#black";
						}}
					></Button>
				</div>
				<div className="card-box revenue-card">
					<div className="revenue-card-content">
						<div className="icon-container">
							<i
								className="pi pi-dollar"
								style={{ fontSize: "24px", color: "#4CAF50" }}
							></i>
						</div>
						<div className="revenue-info">
							<p className="revenue-desc">Total Revenue</p>
							<h4 className="revenue-amount">${revenueData}</h4>
						</div>
					</div>
				</div>
			</div>

			{/* second row */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "row",
					marginTop: "20px",
				}}
			>
				<div style={{ width: "50%", marginRight: "20px", height: "100%" }}>
					<Card style={{ height: "250px" }}>
						<h4 className="headingTitle">Top Property Owners</h4>
						<Table
							columns={columnsTopPropertyOwner}
							dataSource={propertyOwner}
							rowKey="course_id"
							pagination={false}
						/>
					</Card>
				</div>
				<div style={{ width: "50%", height: "100%" }}>
					<Card style={{ height: "250px" }}>
						<h4 className="headingTitle">Property Count by Country</h4>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							{propertyCountByCountryData.map((item) => (
								<div
									key={item.country}
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
										marginBottom: "10px",
										alignItems: "center",
									}}
								>
									{/* Using the countryCodeMap to get the correct flag code */}
									<Flag
										code={countryCodeMap[item.country] || ""} // If no mapping found, it will return empty string
										alt={item.country}
										style={{
											width: "30px",
											height: "20px",
											marginRight: "10px",
										}}
									/>
									<span style={{ fontSize: "16px", fontWeight: "600" }}>
										{item.country}
									</span>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "600",
											color: "#4CAF50",
										}}
									>
										{item.property_count} Properties
									</span>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>

			{/* third row */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "row",
					marginTop: "20px",
				}}
			>
				<div style={{ width: "50%", marginRight: "20px" }}>
					<Card>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<div>
									<h5 className="mb-5 title">Users Registered</h5>
								</div>
								<div style={{ marginBottom: "20px" }}>
									<Select
										defaultValue="week"
										style={{ width: 100 }}
										onChange={handlePeriodChange}
									>
										<Option value="today">Today</Option>
										<Option value="week">This Week</Option>
										<Option value="month">This Month</Option>
									</Select>
								</div>
							</div>
						</div>

						{/* Graph Section */}
						<div>
							<Column {...config} />
						</div>
					</Card>
				</div>
				<div style={{ width: "50%" }}>
					<Card>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<div>
									<h5 className="mb-5 title">Properties Registered</h5>
								</div>
								<div>
									<Select
										defaultValue="week"
										style={{ width: 100 }}
										onChange={handlePropertyPeriodChange}
									>
										<Option value="today">Today</Option>
										<Option value="week">This Week</Option>
										<Option value="month">This Month</Option>
									</Select>
								</div>
							</div>
						</div>

						{/* Graph Section */}
						<div>
							<Column {...propertyConfig} />
						</div>
					</Card>
				</div>
			</div>

			{/* fourth row */}
			<div
				style={{
					marginTop: "20px",
				}}
			>
				<div>
					<Card>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<div>
									<h5 className="mb-5 title">Total Revenue</h5>
								</div>
								<div style={{ marginBottom: "20px" }}>
									<Select
										defaultValue="last 10 days"
										style={{ width: 300 }}
										onChange={handleTransactionChange}
									>
										<Option value="last 10 days">Last 10 days</Option>
										<Option value="last 1 month">Last 1 month</Option>
										<Option value="last 3 months">Last 3 months</Option>
										<Option value="last 6 months">Last 6 months</Option>
										<Option value="last year">Last year</Option>
									</Select>
								</div>
							</div>
						</div>

						{/* Graph Section */}
						<div>
							<Column {...transactionsConfig} />
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
