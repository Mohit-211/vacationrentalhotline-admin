/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { GetPayments } from "../../services/Api/Api";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Box } from "@material-ui/core";
import moment from "moment/moment";

const Payment = () => {
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
			title: "Name",
			dataIndex: "user_name",
			width: "20%",
		},
		// {
		// 	title: "Subscription Plan",
		// 	dataIndex: ["plan_payments", "name"],
		// 	width: "20%",
		// },
        {
			title: "Amount Paid",
			dataIndex: "collectiveAmount",
			width: "20%",
		},
	    {
			title: "Receipt Url",
			dataIndex: "receipt_url",
			width: "20%",
			render: (url) => (
				<a href={url} target="_blank" rel="noopener noreferrer" title={url}>
					{url.length > 30 ? `${url.slice(0, 30)}...` : url}
				</a>
			),
		},
        {
			title: "Payment Mode",
			dataIndex: "payment_mode",
			width: "20%",
		},
		{
			title: "Payment Date",
			dataIndex: "created_at",
			width: "30%",
			render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
		  },
		{
			title: "Status",
			dataIndex: "payment_status",
			width: "20%",
		},
		// {
		// 	title: "Days Left",
		// 	dataIndex: ["payment_users", "no_of_days_left_for_subscription"],
        //     render: (days) => (days === null ? "---" : days),
		// 	width: "20%",
		// },
	];

	// Get all users
	const getData = async (params = {}) => {
		try {
			setLoading(true);
			let result = await GetPayments(
				localStorage.getItem("adminToken"),
				params
			);
			// Adding index for serial number
			const newData = result.data.data.processedData.map((item, index) => ({
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
		const filteredData = userBackupData.filter((item) => {
			const userName = item?.payment_users?.user_profile?.name?.toLowerCase() || '';
			const email = item?.email?.toLowerCase() || '';
			const searchTerm = searchField.toLowerCase();
	
			return userName.includes(searchTerm) || email.includes(searchTerm);
		});
	
		setData(filteredData);
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
					<h3 className="page-title">PAYMENT MANAGEMENT</h3>
					<p className="page-sub-title">
						Manage User Payments and Subscriptions
					</p>
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

export default Payment;
