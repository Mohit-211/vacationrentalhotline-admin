
import axios from "axios";
import { BASE_URL } from "../Host";

export const GetUserCount = async () => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getUserCount");
	return res;
};

export const GetContactUsFormCount = async () => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getContactUsFormCount");
	return res;
};

export const GetTotalpropertyData = async () => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getTotalPropertyCount");
	return res;
};

export const GetTotalRevenue = async () => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getTotalRevenueGenerated");
	return res;
};

export const GetUserRegisteredStatistics = async (period) => {
	return await axios.post(
		`${BASE_URL}admin/dashboard/getNewUsersRegistered`,
		{ period },
		{
			headers: {
				"x-access-token": `${localStorage.getItem("adminToken")}`,
				"Content-Type": "multipart/form-data",
			},
		}
	);
};

export const GetPropertyRegisteredStatistics = async (period) => {
	return await axios.post(
		`${BASE_URL}admin/dashboard/getNewPropertiesRegistered`,
		{ period },
		{
			headers: {
				"x-access-token": `${localStorage.getItem("adminToken")}`,
				"Content-Type": "multipart/form-data",
			},
		}
	);
};

export const GetTopPropertyOwner = async (token) => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getTopPropertyOwners", {
		headers: {
			"x-access-token": token,
			"Content-Type": "multipart/form-data",
		},
	});
	return res;
};

export const GetPropertyCountByCountry = async () => {
	const res = await axios.get(BASE_URL + "/admin/dashboard/getPropertyCountsByCountry");
	return res;
};

export const GetTransactionHistory = async (period, fromDate, toDate) => {
	return await axios.post(
	  `${BASE_URL}admin/dashboard/totalRevenueGenerated`,
	  { period, fromDate, toDate },
	  {
		headers: {
		  'x-access-token': `${localStorage.getItem('adminToken')}`,
		  'Content-Type': 'multipart/form-data',
		},
	  }
	);
  };