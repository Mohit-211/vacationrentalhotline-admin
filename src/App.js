import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import ChangePassword from "./pages/Sidebar/Settings/ChangePassword/ChangePassword";
import MainLayout from "./components/MainLayout";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import RoleList from "./pages/Roles/RoleList";
import AddRole from "./pages/Roles/AddRole";
import EditRole from "./pages/Roles/EditRole";
import AddCustomer from "./pages/Customer/AddCustomer";
import ViewCustomer from "./pages/Customer/ViewCustomer";
import AdminUser from "./pages/AdminManagement/AdminUser";
import ViewAdmin from "./pages/AdminManagement/ViewAdmin";
import AddAdmin from "./pages/AdminManagement/AddAdmin";
import EditAdmin from "./pages/AdminManagement/EditAdmin";
import LoginLogs from "./pages/Sidebar/LoginActivity/LoginLogs";
import Service from "./pages/Services/Service";
import AddService from "./pages/Services/AddService";
import EditService from "./pages/Services/EditService";
import ViewService from "./pages/Services/ViewService";
import TermsAndConditions from "./pages/Content/TermsConditions/TermsAndConditions";
import EditTermsAndConditions from "./pages/Content/TermsConditions/EditTermsAndConditions";
import Support from "./pages/Content/Support/Support";
import AboutUs from "./pages/Content/AboutUs/AboutUs";
import EditAboutUs from "./pages/Content/AboutUs/EditAboutUs";
import Error401 from "./pages/ErrorPages/Error401";
import User from "./pages/Customer/User";
import BannerContent from "./pages/Content/BannerContent/BannerContent";
import AddBanner from "./pages/Content/BannerContent/AddBanner";
import EditBanner from "./pages/Content/BannerContent/EditBanner";
import EditCustomer from "./pages/Customer/EditCustomer";
import Payment from "./pages/Payment/Payment.jsx";
import Property from "./pages/Property/Property.jsx";
import ViewProperty from "./pages/Property/ViewProperty.jsx";
import ViewDashboardProperty from "./pages/Property/ViewDashboardProperty.jsx";
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/Login" element={<Login />} />
				<Route path="/error401" element={<Error401 />} />
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="/reset-password" element={<ChangePassword />} />
					<Route path="/addUser" element={<AddCustomer />} />
					<Route path="/editUser/:id" element={<EditCustomer />} />
					<Route path="/viewUser/:id" element={<ViewCustomer />} />
					<Route path="/role-list" element={<RoleList />} />
					<Route path="/addRole" element={<AddRole />} />
					<Route path="/editRole/:id" element={<EditRole />} />
					<Route path="/adminList" element={<AdminUser />} />
					<Route path="/viewAdmin" element={<ViewAdmin />} />
					<Route path="/addAdmin" element={<AddAdmin />} />
					<Route path="/editAdmin/:id" element={<EditAdmin />} />
					<Route path="/loginLogs" element={<LoginLogs />} />
					<Route path="/services" element={<Service />} />
					<Route path="/addService" element={<AddService />} />
					<Route path="/editService/:id" element={<EditService />} />
					<Route path="/viewService/:id" element={<ViewService />} />

					<Route path="/termsAndConditions" element={<TermsAndConditions />} />
					<Route
						path="/editTermsAndConditions"
						element={<EditTermsAndConditions />}
					/>
					<Route path="/support" element={<Support />} />
					<Route path="/aboutUs" element={<AboutUs />} />
					<Route path="/editAboutUs" element={<EditAboutUs />} />
					<Route path="/users" element={<User />} />
					<Route path="/banner" element={<BannerContent />} />
					<Route path="/addBanner" element={<AddBanner />} />
					<Route path="/editBanner/:id" element={<EditBanner />} />
					<Route path="/payments" element={<Payment />} />
					<Route path="/properties" element={<Property />} />
					<Route path="/viewProperty/:id" element={<ViewProperty />} />
					<Route path="/viewPropertyDetails/:id" element={<ViewDashboardProperty />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
