import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
const CreateEmploye = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Add Employee", link: "#" },
  ]);

  const [optionscat, setOptions] = useState([]);

  const [employee, setemployee] = useState({
    name: "",
    email: "",
    role: "",
  });
  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setemployee({
      ...employee,
      [name]: value,
    });
  };

  //add employee

  const [errors, setErrors] = useState({});

  const handleaddsubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Check each field and set error messages if missing
    if (!employee.name) newErrors.name = "Name is required";
    if (!employee.email) newErrors.email = "Email is required";

    if (!employee.role) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const adminid = localStorage.getItem("adminid");
        const requestBody = {
          ...employee,
          role: employee.role, // Ensure category ID is properly set
          createdBy: adminid, // ✅ added
        };

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/employee/addemployee`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        const res_data = await response.json();
        if (!response.ok) {
          if (res_data.msg === "Email already exist") {
            setErrors({ email: res_data.msg });
          } else {
            toast.error(res_data.msg || "Something went wrong.");
          }
          return;
        }
        toast.success("Employee Added successfully!");
        setErrors("");
        setemployee({
          name: "",
          email: "",
          role: "",
        });
      } catch (error) {
        console.log("Add Features", error);
      }
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/categoryOptions`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const res_data = await response.json();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((item) => ({
            value: item._id,
            label: item.name?.trim() || item.name,
          }))
        : [];
      setOptions(options);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ADD EMPLOYEE" breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <form className="needs-validation" onSubmit={handleaddsubmit}>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="validationCustom01"
                          >
                            First name
                          </Label>
                          <Input
                            value={employee.name || ""}
                            onChange={handleinput}
                            name="name"
                            placeholder="Name"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                          />

                          {errors.name && (
                            <span className="text-danger">{errors.name}</span>
                          )}
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="validationCustom02"
                          >
                            Email
                          </Label>
                          <Input
                            name="email"
                            placeholder="Email"
                            value={employee.email || ""}
                            onChange={handleinput}
                            type="email"
                            className="form-control"
                            id="validationCustom02"
                          />
                          {errors.email && (
                            <span className="text-danger">{errors.email}</span>
                          )}
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Select Role</Label>
                          <Select
                            options={optionscat}
                            name="role"
                            value={
                              optionscat.find(
                                (option) => option.value === employee.role
                              ) || null
                            } // FIXED: Match employee.role
                            onChange={(selectedOption) => {
                              setemployee((prev) => ({
                                ...prev,
                                role: selectedOption
                                  ? selectedOption.value
                                  : "",
                              }));
                            }}
                            isClearable
                            placeholder="Choose..."
                          />

                          {errors.role && (
                            <span className="text-danger">{errors.role}</span>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Button color="primary" type="submit">
                      Add
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateEmploye;
