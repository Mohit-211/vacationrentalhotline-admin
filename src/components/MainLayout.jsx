/** @format */

import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiLogin } from "react-icons/ci";
import { Layout, theme, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import { message } from "antd";
import Login from "../pages/Login/Login";
import { GetAdminProfile } from "../services/Api/Api";
import { IoIosPricetags } from "react-icons/io";
import { MdContacts } from "react-icons/md";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
	const navigate = useNavigate();
	const [idData, setIdData] = React.useState({});

	const getData = async () => {
		try {
		  let result = await GetAdminProfile(localStorage.getItem("adminToken"));
	
		  // Check if the request was successful and set data
		  if (result.status === 200) {
			setIdData(result.data.data);
		  } else if (result.status === 500 && result.data.message === "jwt expired") {
			navigate("/Login");
			message.error("Your session has expired. Please login again.");
		  } else if (result.status === 403 && result.data.message === "Admin not found.") {
			navigate("/Login");
			message.error("Your account has been deleted by the admin. Please contact them for further assistance.");
		  }
		} catch (e) {
		  // Handle errors in the request
		  if (e.response) {
			// Log the error response to debug
			console.log(e.response);
	
			if (e.response.status === 500 && e.response.data.message === "jwt expired") {
			  navigate("/Login");
			  message.error("Your session has expired. Please login again.");
			} else if (e.response.status === 403 && e.response.data.message === "Admin not found.") {
			  navigate("/Login");
			  message.error("Your account has been deleted by the admin. Please contact them for further assistance.");
			}
		  } else {
			
			console.log(e);
		  }
		}
	  };
	

	useEffect(() => {
		// Call getData immediately
		getData();

		// Set up interval to call getData every 10 seconds
		const interval = setInterval(() => {
			getData();
		}, 10000); // 10000 ms = 10 seconds

		// Clean up interval when component is unmounted
		return () => clearInterval(interval);
	}, []);

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();


	function logout() {
		localStorage.removeItem("adminToken");
		message.success(" Logged Out Successfully");
		setTimeout(() => {
			navigate("/Login");
		}, 1000);
	}

	const token = localStorage.getItem("adminToken");

	return (
		<>
			{token ? (
				<Layout>
					<Sider
						trigger={null}
						collapsible
						collapsed={collapsed}
						className="sidebar"
					>
						<div className="logo">
							<h2 className="text-white fs-5 text-center py-3 mb-0">
								<span className="sm-logo">VRH</span>
								<span className="lg-logo">VACATION RENTAL</span>
							</h2>
						</div>

						<Menu
							theme="dark"
							mode="inline"
							defaultSelectedKeys={[""]}
							onClick={({ key }) => navigate(key)}
							items={[
								{
									key: "/",
									icon: <AiOutlineDashboard className="fs-4" />,
									label: "Dashboard",
								},
								{
									key: "/users",
									icon: <FaUsers className="fs-4" />,
									label: "Users",
								},
								{
									key: "/payments",
									icon: <IoIosPricetags className="fs-4" />,
									label: "Payments",
								},

								{
									key: "/support",
									icon: <MdContacts className="fs-4" />,
									label: "Contact",
								},

								{
									key: "/adminList",
									icon: <MdManageAccounts className="fs-4" />,
									label: "Access Management",
								},
							]}
						/>
					</Sider>
					<Layout className="site-layout">
						<Header
							className="d-flex justify-content-between ps-1 pe-5"
							style={{
								padding: 0,
								background: colorBgContainer,
							}}
						>
							{React.createElement(
								collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
								{
									className: "trigger",
									onClick: () => setCollapsed(!collapsed),
								}
							)}
							<div className="d-flex gap-4 align-items-center">
								<div className="vertical-line"></div>
								<div className="position-relative">
									<div className="d-flex align-items-center">
										<div
											role="button"
											id="dropdownMenuLink"
											data-bs-toggle="dropdown"
											aria-expanded="false"
											className="d-flex align-items-center"
										>
											<FaRegCircleUser className="fs-3 me-2" />
											<div className="d-flex flex-column">
												{" "}
												<p className="mb-0" style={{ fontWeight: "700" }}>
													{idData?.name}
												</p>
												<p className="mb-0">{idData?.admin_role?.name || ""}</p>
											</div>
										</div>
										<div
											className="dropdown-menu admin"
											aria-labelledby="dropdownMenuLink"
											style={{
												borderTopColor: "purple",
												borderTopWidth: "4px",
											}}
										>
											<li to="/viewAdmin">
												<Link
													className="dropdown-item py-1 mb-1"
													style={{ height: "auto", lineHeight: "30px" }}
													to="/viewAdmin"
												>
													<FiUser style={{ marginRight: "10px" }} />
													View Profile
												</Link>
											</li>
											<li>
												<Link
													className="dropdown-item py-1 mb-1"
													style={{ height: "auto", lineHeight: "30px" }}
													to="/reset-password"
												>
													<LuSettings style={{ marginRight: "10px" }} />
													Change Password
												</Link>
											</li>
											<div className="dropdown-divider"></div>
											<li>
												<Link
													className="dropdown-item py-1 mb-1"
													style={{ height: "auto", lineHeight: "30px" }}
													onClick={() => logout()}
												>
													<CiLogin style={{ marginRight: "10px" }} />
													Sign Out
												</Link>
											</li>
										</div>
									</div>
								</div>
							</div>
						</Header>
						<Content
							style={{
								margin: "24px 16px",
								padding: 24,
								minHeight: 280,
								background: colorBgContainer,
							}}
						>
							<ToastContainer
								position="top-right"
								autoClose={250}
								hideProgressBar={false}
								newestOnTop={true}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								theme="light"
							/>
							<Outlet />
						</Content>
					</Layout>
				</Layout>
			) : (
				<Login />
			)}
		</>
	);
};
export default MainLayout;
