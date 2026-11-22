import React, { useLayoutEffect, useState } from "react";
import { Button } from "primereact/button";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Row } from "react-bootstrap";
import { GetUserById, UpdateUser } from "../../services/Api/Api.jsx";
import { Card } from "primereact/card";
import { message } from "antd";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [disable, setDisable] = useState(false);
  const [userData, setUserData] = useState({
    user_profile: { name: "" },
    email: "",
    subscription_status: "",
  });

  const navigateToUser = () => {
    navigate("/users");
  };

  useLayoutEffect(() => {
    GetUserById(id)
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setUserData({
        ...userData,
        user_profile: { ...userData.user_profile, name: value },
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("name", userData.user_profile.name);
    formData.append("email", userData.email);
    formData.append("subscription_status", userData.subscription_status);

    UpdateUser(formData)
      .then((res) => {
        if (res.status === 200) {
          message.success("User Profile edited successfully!");
        }
        navigateToUser();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          message.error("Token expired!");
          localStorage.removeItem("adminToken");
          setTimeout(() => {
            navigate("/Login");
          }, 3000);
        } else {
          message.error("Something went wrong");
        }
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div>
          <h3 className="page-title">USER MANAGEMENT</h3>
          <p className="page-sub-title">Update User Information</p>
        </div>
        <div>
          <Button
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={navigateToUser}
            style={{ borderRadius: "5px", height: "47px" }}
          >
            <span style={{ marginLeft: "5px" }}>Return to Users</span>
          </Button>
        </div>
      </Box>

      <Card>
        <div className="admin_profile">
          <Form className="admin_details_form" onSubmit={handleSubmit}>
            <Row>
              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  name="name"
                  value={userData.user_profile.name}
                  type="text"
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  name="email"
                  value={userData.email}
                  type="text"
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group className="mb-3">
                <Form.Label>Subscription Status:</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  className="new_form_control"
                  value={userData.subscription_status}
                  onChange={(e) => onChange(e)}
                  name="subscription_status"
                >
                  <option value="">Select Status:</option>
                  <option value="SUBSCRIBED">SUBSCRIBED</option>
                  <option value="UNSUBSCRIBED">UNSUBSCRIBED</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <div style={{ marginTop: "40px" }}>
              <Button
                icon="pi pi-check"
                severity="info"
                type="submit"
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
                onClick={navigateToUser}
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
    </Box>
  );
};

export default EditCustomer;
