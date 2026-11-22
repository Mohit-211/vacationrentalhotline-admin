import React, { useEffect, useState } from "react";
import { Table, Space, message } from "antd";
import { Button } from "primereact/button";
import { DeleteUser, GetUsers } from "../../services/Api/Api";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Box } from "@material-ui/core";
import Alert from "./Alert";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'; 

const User = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userBackupData, setUserBackupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      dataIndex: ["user_profile", "name"],
      sorter: (a, b) => a.user_profile.name.localeCompare(b.user_profile.name),
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "30%",
      render: (email, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{email}</span>
          {record.is_verified ? (
            <CheckCircleOutlined style={{ color: 'green', marginLeft: '8px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red', marginLeft: '8px' }} />
          )}
        </div>
      ),
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   width: "30%",
    // },
    {
      title: "Mobile",
      dataIndex: ["user_profile", "mobile"],
      width: "20%",
      render: (mobile) => (mobile ? mobile : "---"),
    },
    {
      title: "Address",
      dataIndex: ["user_profile", "full_address"],
      width: "20%",
      render: (address) => (address ? address : "--"),
    },
    {
      title: "Number of Properties",
      dataIndex: "active_property_count",
      width: "20%",
    },
  
	
    {
      title: "Action",
      dataIndex: "action",
      width: "50%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon="pi pi-eye"
            rounded
            outlined
            className="mr-2"
            style={{ margin: "0px", borderRadius: "25px" }}
            onClick={(event) => navigateToViewUser(event, record.id)}
          />
          <Alert
            title="User"
            handleDelete={() => removeUser(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Get all users
  const getData = async (params = {}) => {
    try {
      setLoading(true);
      let result = await GetUsers(localStorage.getItem("adminToken"), params);
       // Adding index for serial number
       const newData = result.data.data.data.map((item, index) => ({
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
        LIST[i]?.user_profile?.name?.toLowerCase()?.includes(searchField?.toLowerCase()) ||
        LIST[i]?.email?.toLowerCase()?.includes(searchField?.toLowerCase())
      ) {
        searchList.push(LIST[i]);
      }
    }

    setData(searchList);
  };

  const removeUser = async (user_id) => {
    setIsModalVisible(false);
    try {
      let res = await DeleteUser(user_id, localStorage.getItem("adminToken"));
      message.success(res?.data?.message);
      getData();
    } catch (error) {
      console.log(error, "error");
      if (error.response && error.response.status === 401) {
        message.error("Token expired");
        localStorage.removeItem("adminToken");
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      } else {
        message.error("Something went wrong");
      }
    }
  };


  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Name,Email\n" +
      data.map(row => `${row.id},${row.name},${row.email}`).join("\n");

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
  };

  const navigateToAddUser = () => {
    navigate("/addUser");
  };

  const navigateToViewUser = (event, id) => {
    navigate(`/viewUser/${id}`);
  };

  const navigateToEditUser = (event, id) => {
    navigate(`/editUser/${id}`);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <div>
          <h3 className="page-title">USER MANAGEMENT</h3>
          <p className="page-sub-title">View, delete, and add User</p>
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
           
			  <Button
              icon="pi pi-cloud-download"
              severity="success"
              style={{ marginLeft: "10px", borderRadius: "5px", height: "47px" }}
              onClick={exportToCSV}
            />
			 <Button
              icon="pi pi-plus"
              severity="info"
              style={{ margin: "0px 10px", borderRadius: "5px", height: "47px" }}
              onClick={navigateToAddUser}
            />
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

export default User;
