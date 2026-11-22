import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { AddUser } from "../../services/Api/Api";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { message } from "antd";

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisable(true);

    if (!name) {
      message.error("Please enter name ");
      setDisable(false); 
      return;
    }
    if (!email) {
      message.error("Please enter  email");
      setDisable(false); 
      return;
    }


    try {
      const response = await AddUser({
        email: email,
        name: name,
        role_id: "6",
      });

      if (response.status === 200) {
        message.success("User added successfully");
      }
      setTimeout(() => {
        navigate("/users");
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
        }, 3000);
      } else {
        message.error("Something went wrong");
      }
      setDisable(false);
    }
  };

  const navigateToUser = () => {
    navigate("/users");
  };

  return (
    <Box >
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
      <div>
          <h3 className="page-title">USER MANAGEMENT</h3>
          <p className="page-sub-title">Create New User</p>
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
        <div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
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
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="new_form_control"
              />
            </Form.Group>



            <div style={{ marginTop: "40px" }}>
              <Button
                icon="pi pi-check"
                severity="info"
                type="submit"
                onClick={handleSubmit}
                disabled={disable}
                style={{
              
                  height:"45px",
                  padding:"20px",
                  borderRadius:"5px"
                }}
              >
                {disable ? "Saving...." : "Save"}
              </Button>

              <Button
                icon="pi pi-times"
                severity="secondary"
                onClick={(e) => {
                  navigateToUser();
                }}
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  height:"45px",
                  padding:"20px",
                  borderRadius:"5px"
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

export default AddCustomer;
