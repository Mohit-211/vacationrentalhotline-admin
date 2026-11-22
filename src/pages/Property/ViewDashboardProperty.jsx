/** @format */

import React, { useLayoutEffect, useState } from "react";
import { Button } from "primereact/button";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { GetPropertyById } from "../../services/Api/Api";
import { Card } from "primereact/card";
import { Row, Col } from "react-bootstrap";

const ViewDashboardProperty = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [propertyData, setPropertyData] = useState({});

	useLayoutEffect(() => {
		const fetchBookingData = async () => {
			try {
				const res = await GetPropertyById(id);
				setPropertyData(res.data.data);
			} catch (error) {
				console.error("Failed to fetch booking data:", error);
			}
		};

		fetchBookingData();
	}, [id]);

	const navigateToUser = () => {
		navigate(`/properties`);
	};

	const propertyNotes = propertyData?.property_notes || [];

	const formatDate = (date) => {
		if (!date) return "---";
		return new Date(date).toLocaleString("en-GB", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
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
					<h3 className="page-title">PROPERTY DETAILS</h3>
				</div>
				<div>
					<Button
						icon="pi pi-arrow-left"
						severity="secondary"
						onClick={navigateToUser}
						style={{ borderRadius: "5px", height: "47px" }}
					>
						<span style={{ marginLeft: "5px" }}>Return to Properties</span>
					</Button>
				</div>
			</Box>

			<Form className="admin_details_form">
				<div style={{ display: "flex", flexDirection: "column" }}>
					<Card
						style={{ width: "100%", marginRight: "20px", marginBottom: "40px" }}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(4, 1fr)",
								gap: "20px",
								marginBottom: "40px",
							}}
						>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Address Line 1:
								</h5>
								<p>{propertyData?.address_line_1 || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Address Line 2:
								</h5>
								<p>{propertyData?.address_line_2 || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									City:
								</h5>
								<p>{propertyData?.city || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									State:
								</h5>
								<p>{propertyData?.state || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Zip Code:
								</h5>
								<p>{propertyData?.zip_code || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Country:
								</h5>
								<p>{propertyData?.country || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Property Owner Name:
								</h5>
								<p>{propertyData?.property_owner_name || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Email 1:
								</h5>
								<p>{propertyData?.property_owner_email_1 || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Email 2:
								</h5>
								<p>{propertyData?.property_owner_email_2 || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Phone number 1:
								</h5>
								<p>{propertyData?.property_owner_mobile_number_1 || "---"}</p>
							</div>
							<div>
								<h5
									style={{
										fontSize: "0.9rem",
										fontFamily: "Cerebri Sans,sans-serif",
										fontWeight: "700",
										marginTop: "14px",
										color: "black",
									}}
								>
									Phone number 2:
								</h5>
								<p>{propertyData?.property_owner_mobile_number_2 || "---"}</p>
							</div>
						</div>
					</Card>

					<Card
						style={{ width: "100%", marginRight: "20px", marginBottom: "40px" }}
					>
						<div style={{ margin: "0 0 7px 0px" }}>
							<Row>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "black",
										}}
									>
										Subscription Status:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{propertyData?.subscription_status === "ACTIVATE"
											? "Active"
											: propertyData?.subscription_status === "DEACTIVATE"
											? "Inactive"
											: "---"}
									</p>
								</Col>

								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "black",
										}}
									>
										Subscription Start Date:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{formatDate(propertyData?.subscription_start_date)}
									</p>
								</Col>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "black",
										}}
									>
										Subscription End Date:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{formatDate(propertyData?.subscription_end_date)}
									</p>
								</Col>
								<Col>
									<h5
										style={{
											fontSize: "0.9rem",
											fontFamily: "Cerebri Sans,sans-serif",
											fontWeight: "700",
											marginTop: "14px",
											color: "black",
										}}
									>
										Validity:
									</h5>
									<p style={{ marginBottom: "20px" }}>
										{propertyData?.validity}
									</p>
								</Col>
							</Row>
						</div>
					</Card>

					<Card
						style={{ width: "100%", marginRight: "20px", marginBottom: "40px" }}
					>
						<h5 style={{ color: propertyNotes.length > 0 ? "black" : "blue" }}>
							Notes:
						</h5>
						<ul>
							{propertyNotes.map((note, index) => (
								<li key={index}>{note.notes}</li>
							))}
						</ul>
						{propertyNotes.length === 0 && <p>No notes provided.</p>}
					</Card>
				</div>
			</Form>
		</Box>
	);
};

export default ViewDashboardProperty;
