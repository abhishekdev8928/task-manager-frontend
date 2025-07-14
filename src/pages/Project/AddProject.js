import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from "react-toastify";

const AddProject = () => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Project", link: "#" },
  ];

  const handleDateChange = (selectedDates, name) => {
    const selectedDate = selectedDates[0];
    const formattedDate = selectedDate.toISOString().split("T")[0]; // 👉 "YYYY-MM-DD"
    setProject((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const fetchOptions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/project/categoryOptions`
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

  const [project, setProject] = useState({
    name: "",
    start_date: "",
    end_date: "",
    client: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [optionscat, setOptions] = useState([]);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setProject({
      ...project,
      [name]: value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!project.name) newErrors.name = "Name is required";
    if (!project.client) newErrors.client = "Client is required";
    if (!project.description) newErrors.description = "Description is required";
    if (!project.start_date) newErrors.start_date = "Start Date is required";
    if (!project.end_date) newErrors.end_date = "End Date is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");
      const requestBody = {
        ...project,
        client: project.client, // Ensure category ID is properly set
        createdBy: adminid, // ✅ added
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/project/addproject`,
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
        if (res_data.msg === "Name already exist") {
          setErrors({ name: res_data.msg });
        } else {
          toast.error(res_data.msg || "Something went wrong.");
        }
        return;
      }

      toast.success("Project Added Successfully");
      setProject({
        name: "",
        start_date: "",
        end_date: "",
        client: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Add Project Error:", error);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD PROJECT" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Project Name</Label>
                      <Input
                        value={project.name}
                        onChange={handleInput}
                        name="name"
                        type="text"
                        placeholder="Project Name"
                      />
                      {errors.name && (
                        <span className="text-danger">{errors.name}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Client</Label>
                      <Select
                        options={optionscat}
                        name="client"
                        value={
                          optionscat.find(
                            (option) => option.value === project.client
                          ) || null
                        } // FIXED: Match employee.role
                        onChange={(selectedOption) => {
                          setProject((prev) => ({
                            ...prev,
                            client: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                        isClearable
                        placeholder="Choose..."
                      />
                      {errors.client && (
                        <span className="text-danger">{errors.client}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Start Date</Label>
                      <Flatpickr
                        className="form-control"
                        value={project.start_date}
                        onChange={(date) =>
                          handleDateChange(date, "start_date")
                        }
                        options={{ dateFormat: "Y-m-d" }}
                      />

                      {errors.start_date && (
                        <span className="text-danger">{errors.start_date}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>End Date</Label>
                      <Flatpickr
                        className="form-control"
                        value={project.end_date}
                        onChange={(date) => handleDateChange(date, "end_date")}
                        options={{ dateFormat: "Y-m-d" }}
                      />
                      {errors.end_date && (
                        <span className="text-danger">{errors.end_date}</span>
                      )}
                    </Col>

                    <Col md="12">
                      <Label>Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        value={project.description}
                        onChange={handleInput}
                        placeholder="Project Description"
                      />
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Add Project
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddProject;
