/** @format */

import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";
import { Button } from "primereact/button";
import Form from "react-bootstrap/Form";
import { CreateAdmin } from "../../services/Api/Api";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { message } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import { Steps } from "antd";

const AddAdmin = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [roleId, setRoleId] = useState("");
	const [disable, setDisable] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setDisable(true);

		if (!name) {
			setDisable(false);
			message.error("Please enter name");

			return;
		}
		if (!email) {
			setDisable(false);
			message.error("Please enter email");
			return;
		}
		if (!roleId) {
			setDisable(false);
			message.error("Please choose any Role");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("email", email);
			formData.append("role_id", parseInt(roleId, 10));

			const response = await CreateAdmin(formData);

			if (response.status === 201) {
				message.success("Admin added successfully");
			}
			setTimeout(() => {
				navigate("/adminList");
			}, 1000);
			setDisable(false);
		} catch (error) {
			if (error.response && error.response.status === 400) {
				message.error("Email already exists");
			} else if (error.response.status === 401) {
				message.error("Token expired");
				localStorage.removeItem("adminToken");
				setTimeout(() => {
					navigate("/Login");
				}, 1000);
			} else {
				message.error("Something went wrong");
			}
			setDisable(false);
		}
	};

	const navigateToAdmin = () => {
		navigate("/adminList");
	};

	return (
		<Box m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginBottom="30px"
			>
				<div>
					<h3 className="page-title">Create New Admin</h3>
					<p className="page-sub-title">Create New Admin</p>
				</div>
				<div>
					<Button
						icon="pi pi-arrow-left"
						severity="secondary"
						onClick={navigateToAdmin}
						style={{ borderRadius: "5px", height: "47px" }}
					>
						<span style={{ marginLeft: "5px" }}>Return to Admin</span>
					</Button>
				</div>
			</Box>
			<div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
				<Card style={{ width: "100%" }}>
					<div>
						<Form>
							<Form.Group className="mb-3">
								<Form.Label> Name</Form.Label>
								<Form.Control
									type="text"
									required
									placeholder="Enter name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="new_form_control"
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email}
									required
									onChange={(e) => setEmail(e.target.value)}
									className="new_form_control"
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Select Role :</Form.Label>

								<Form.Select
									aria-label="Default select example"
									value={roleId}
									onChange={(e) => setRoleId(e.target.value)}
									className="new_form_control"
								>
									<option>Select Role</option>
									<option value="1">ADMIN</option>
									<option value="6">EMPLOYEE</option>
								</Form.Select>
							</Form.Group>

							<div style={{ marginTop: "40px" }}>
								<Button
									icon="pi pi-check"
									severity="info"
									type="submit"
									onClick={handleSubmit}
									disabled={disable}
									style={{
										height: "45px",
										padding: "20px",
										borderRadius: "5px",
									}}
								>
									{disable ? "Saving...." : "Save"}
								</Button>

								<Button
									icon="pi pi-times"
									severity="secondary"
									onClick={(e) => {
										navigateToAdmin();
									}}
									style={{
										marginLeft: "10px",
										marginTop: "10px",
										height: "45px",
										padding: "20px",
										borderRadius: "5px",
									}}
								>
									Cancel
								</Button>
							</div>
						</Form>
					</div>
				</Card>
				<Card
					className="admin_description"
					style={{ width: "30%", marginLeft: "10px" }}
				>
					<Steps
						direction="vertical"
						size="small"
						items={[
							{
								title: "ADMIN",
								status: "finish",
								icon: <SolutionOutlined />,
								description:
									"This role grants extensive access and permissions across all features and pages of the admin panel",
							},
							{
								title: "EMPLOYEE",
								status: "finish",
								icon: <SolutionOutlined />,
								description:
									"This role is more focused, allowing admins to view, edit, and delete content specifically in the User only.",
							},
						]}
					/>
				</Card>
			</div>
		</Box>
	);
};

export default AddAdmin;
