/** @format */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "primereact/button";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { GetUserById, GetPropertyByUserId } from "../../services/Api/Api";
import { Card } from "primereact/card";
import { Table } from "antd";
import { Row, Col } from "react-bootstrap";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import "./Customers.css";

const ViewCustomer = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [userData, setUserData] = useState([]);
	const [propertyData, setPropertyData] = useState([]);

	useLayoutEffect(() => {
		GetUserById(id)
			.then((res) => {
				setUserData(res.data.data);
			})
			.catch((err) => {
				console.log(err, "error");
			});
	}, [id]);

	const getData = async (user_id) => {
		try {
			const formData = { user_id: id };
			let result = await GetPropertyByUserId(formData);
			const dataWithIndex = result.data.data.map((item, index) => ({
				...item,
				autoIncrementId: index + 1,
			}));
			setPropertyData(dataWithIndex);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, [id]);

	const navigateToUser = () => {
		navigate("/users");
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "autoIncrementId",
			key: "id",
		},
		{
			title: "Property Owner",
			dataIndex: "property_owner_name",
			key: "type",
		},
		{
			title: "Rental Property Address",
			dataIndex: "full_address",
			key: "address",
		},
		{
			title: "Subscription Start Time",
			dataIndex: "subscription_start_date",
			key: "subscription_start_date",
			render: (time) => (time ? new Date(time).toLocaleString() : "---"),
		},
		{
			title: "Subscription End Time",
			dataIndex: "subscription_end_date",
			key: "subscription_end_date",
			render: (time) => (time ? new Date(time).toLocaleString() : "---"),
		},
		{
			title: "",
			key: "redirect",
			render: (text, record) => (
				<IoArrowForwardCircleOutline
					style={{ fontSize: "20px", cursor: "pointer" }}
					className="redirect_button"
					onClick={() => navigate(`/viewProperty/${record.id}`)}
				/>
			),
		},
	];

	const exportToCSV = () => {
		const csvContent =
			"data:text/csv;charset=utf-8," +
			// Header row
			"ID,Property Owner,Property Owner Email 1,Property Owner Email 2,Property Owner Mobile 1,Property Owner Mobile 2,Full Address,Address Line 1,Address Line 2,Country,State,City,Zip Code\n" +
			// Data rows
			propertyData
				.map((row) => {
					// Function to escape CSV fields
					const escapeCsvField = (field) => {
						if (field === null || field === undefined) return '';
						const escaped = String(field)
							.replace(/"/g, '""') // Escape double quotes
							.replace(/\r?\n|\r/g, ' '); // Replace line breaks with spaces
						return `"${escaped}"`; // Enclose in double quotes
					};
	
					return [
						escapeCsvField(row.autoIncrementId),
						escapeCsvField(row.property_owner_name),
						escapeCsvField(row.property_owner_email_1),
						escapeCsvField(row.property_owner_email_2),
						escapeCsvField(row.property_owner_mobile_number_1),
						escapeCsvField(row.property_owner_mobile_number_2),
						escapeCsvField(row.full_address),
						escapeCsvField(row.address_line_1),
						escapeCsvField(row.address_line_2),
						escapeCsvField(row.country),
						escapeCsvField(row.state),
						escapeCsvField(row.city),
						escapeCsvField(row.zip_code),
					].join(',');
				})
				.join("\n");
	
		const encodedURI = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedURI);
		link.setAttribute("download", "property.csv");
		document.body.appendChild(link);
		link.click();
	};
	

	return (
		<Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginBottom="30px"
			>
				<div>
					<h3 className="page-title">User MANAGEMENT</h3>
					<p className="page-sub-title">View Information related with User</p>
				</div>
				<div>
					<Button
						icon="pi pi-arrow-left"
						severity="secondary"
						onClick={navigateToUser}
						style={{ borderRadius: "5px", height: "47px" }}
					>
						<span style={{ marginLeft: "5px" }}>Return to User</span>
					</Button>
				</div>
			</Box>

			<Form className="admin_details_form">
				<div style={{ display: "flex", flexDirection: "column" }}>
					<Card style={{ width: "100%", marginRight: "20px" }}>
						<div style={{ margin: "0 0 7px 0px" }}>
							<h4
								style={{
									fontSize: "1.2rem",
									fontFamily: "Cerebri Sans,sans-serif",
									fontWeight: "600",
									marginBottom: "20px",
									color: "#1677FF",
								}}
							>
								User's Information :
							</h4>
							<Row>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "darkgray",
										}}
									>
										User's Name:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{userData?.user_profile?.name}
									</p>
								</Col>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "darkgray",
										}}
									>
										User's Email:
									</h5>
									<p style={{ marginBottom: "20px" }}>{userData?.email}</p>
								</Col>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "darkgray",
										}}
									>
										User's Mobile Number:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{userData?.user_profile?.mobile}
									</p>
								</Col>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "darkgray",
										}}
									>
										User's Address:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{userData?.user_profile?.full_address
											? userData?.user_profile?.full_address
											: "--"}
									</p>
								</Col>
							</Row>
						</div>
					</Card>

					<Box display="flex" justifyContent="flex-end" marginTop="20px">
						<Button
							icon="pi pi-cloud-download"
							severity="success"
							style={{
								marginLeft: "10px",
								borderRadius: "5px",
								height: "47px",
							}}
							onClick={exportToCSV}
						>
							Export CSV
						</Button>
					</Box>

					<Card
						style={{
							width: "100%",
							marginTop: "20px",
						}}
					>
						<h4
							style={{
								fontSize: "1.2rem",
								fontFamily: "Cerebri Sans,sans-serif",
								fontWeight: "600",
								marginBottom: "20px",
								color: "#1677FF",
							}}
						>
							Property Details:
						</h4>
						<Table
							columns={columns}
							dataSource={propertyData}
							pagination={{ pageSize: 10 }}
						/>
					</Card>
				</div>
			</Form>
		</Box>
	);
};

export default ViewCustomer;
