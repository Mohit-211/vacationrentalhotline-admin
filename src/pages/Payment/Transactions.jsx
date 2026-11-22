/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "antd";

import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Box } from "@material-ui/core";
import moment from "moment/moment";
import { GetTransactionHistory } from "../../services/Api/DashboardApi";

const Transactions = () => {
	const navigate = useNavigate();
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

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
	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const result = await GetTransactionHistory(
				localStorage.getItem("adminToken")
			);
			setTransactions(result.data.data || []);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	// const onSearch = (searchField) => {
	// 	const filteredData = userBackupData.filter((item) => {
	// 		const userName =
	// 			item?.payment_users?.user_profile?.name?.toLowerCase() || "";
	// 		const email = item?.email?.toLowerCase() || "";
	// 		const searchTerm = searchField.toLowerCase();

	// 		return userName.includes(searchTerm) || email.includes(searchTerm);
	// 	});

	// 	setData(filteredData);
	// };

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
					{/* <Box>
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
					</Box> */}
				</Box>
			</Box>
			<Table
				columns={columns}
				dataSource={transactions}
				rowKey="transaction_id"
				pagination={false}
			/>
		</Box>
	);
};

export default Transactions;
