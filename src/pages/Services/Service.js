import React, { useEffect, useState } from "react";
import { Table, Space, message } from "antd";
import { Button } from "primereact/button";
import { GetServices, DeleteService } from "../../services/Api/ServiceApi";
import { useNavigate } from "react-router";
import { Box } from "@material-ui/core";
import Alert from "../Customer/Alert";
import "./Service.css";

const Service = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState([]);
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
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      width: "30%",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon="pi pi-eye"
            rounded
            outlined
            severity="warning"
            style={{ borderRadius: "25px" }}
            onClick={(event) => navigateToViewService(event, record.id)}
          />
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            style={{ borderRadius: "25px" }}
            onClick={(event) => navigateToEditService(event, record.id)}
          />
          <Alert title="Service" handleDelete={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const getData = async (params = {}) => {
    try {
      setLoading(true);
      let result = await GetServices(localStorage.getItem("adminToken"), params);
      // Adding index for serial number
      const newData = result.data.data.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      setServiceData(newData);
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

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  useEffect(() => {
    getData({
      page: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
      sortField: tableParams.sortField,
      sortOrder: tableParams.sortOrder,
    });
  }, [tableParams]);

  const handleDelete = (id) => {
    DeleteService(id)
      .then((res) => {
        message.success(res?.data?.message);
        getData();
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const navigateToAddService = () => {
    navigate("/addService");
  };

  const navigateToViewService = (event, id) => {
    navigate(`/viewService/${id}`);
  };

  const navigateToEditService = (event, id) => {
    navigate(`/editService/${id}`);
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
          <h3 className="page-title">Services</h3>{" "}
          <p className="page-sub-title">View, delete, edit and add Service</p>
        </div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Button
              label=" Add Service"
              icon="pi pi-plus"
              severity="info"
              style={{
                margin: "0px 10px",
                borderRadius: "5px",
                height: "47px",
              }}
              onClick={navigateToAddService}
            />
          </Box>
        </Box>
      </Box>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={serviceData}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Box>
  );
};

export default Service;
