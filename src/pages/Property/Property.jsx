/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { GetProperties } from "../../services/Api/Api";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Box } from "@material-ui/core";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Button } from "primereact/button";

const Property = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [userBackupData, setUserBackupData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tableParams, setTableParams] = useState({
		pagination: {
			current: 1,
			pageSize: 20,
		},
		sortField: null,
		sortOrder: null,
	});

	const columns = [
		{
			title: "S.No.",
			dataIndex: "index",
			sorter: (a, b) => a.index - b.index,
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
					onClick={() => navigate(`/viewPropertyDetails/${record.id}`)}
				/>
			),
		},
	];

	// Get all users
	const getData = async (params = {}) => {
		try {
			setLoading(true);
			let result = await GetProperties(
				localStorage.getItem("adminToken"),
				params
			);
			// Adding index for serial number
			const newData = result.data.data.map((item, index) => ({
				...item,
				index: index + 1,
			}));
			setData(newData);
			setUserBackupData(newData);
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

	useEffect(() => {
		getData({
			page: tableParams.pagination.current,
			pageSize: tableParams.pagination.pageSize,
			sortField: tableParams.sortField,
			sortOrder: tableParams.sortOrder,
		});
	}, [tableParams]);

	const handleTableChange = (pagination, filters, sorter) => {
		setTableParams({
			pagination,
			filters,
			sortField: sorter.field,
			sortOrder: sorter.order,
		});
	};

	const onSearch = (searchField) => {
		const LIST = [...userBackupData];
		const searchList = [];

		for (let i in LIST) {
			if (
				LIST[i]?.property_owner_name
					?.toLowerCase()
					?.includes(searchField?.toLowerCase()) ||
				LIST[i]?.property_owner_email
					?.toLowerCase()
					?.includes(searchField?.toLowerCase())
			) {
				searchList.push(LIST[i]);
			}
		}

		setData(searchList);
	};

	const navigateToUser = () => {
		navigate(`/`);
	};

	return (
		<Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginBottom="20px"
			>
				<div>
					<h3 className="page-title">PROPERTY MANAGEMENT</h3>
					<p className="page-sub-title">Manage properties</p>
				</div>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Box>
						<span className="p-input-icon-left">
							<i className="pi pi-search" />
							<InputText
								type="search"
								onChange={(e) => {
									onSearch(e.target.value);
								}}
								placeholder="Search..."
							/>
						</span>
					</Box>
					<div>
						<Button
							icon="pi pi-arrow-left"
							severity="secondary"
							onClick={navigateToUser}
							style={{ borderRadius: "5px", height: "47px",marginLeft:"20px" }}
						>
							<span style={{ marginLeft: "5px" }}>Return to Dashboard</span>
						</Button>
					</div>
				</Box>
			</Box>
			<Table
				columns={columns}
				rowKey={(record) => record.id}
				dataSource={data}
				pagination={tableParams.pagination}
				loading={loading}
				onChange={handleTableChange}
			/>
		</Box>
	);
};

export default Property;
