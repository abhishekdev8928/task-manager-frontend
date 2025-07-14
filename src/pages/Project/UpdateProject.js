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
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateProject = () => {
  const { id } = useParams(); // Now valid
  const [project, setProject] = useState({
    name: "",
    start_date: "",
    end_date: "",
    client: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [optionscat, setOptions] = useState([]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Update Project", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (selectedDates, name) => {
    const selectedDate = selectedDates[0];
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setProject((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const fetchProjectById = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/getprojectByid/${id}`);
      const data = await res.json();
      if (res.ok) {
        const item = data.msg;
        setProject({
          name: item.name || "",
          client: item.client || "",
          description: item.description || "",
          start_date: item.start_date?.split("T")[0] || "",
          end_date: item.end_date?.split("T")[0] || "",
        });
      } else {
        toast.error("Failed to load project");
      }
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/categoryOptions`);
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
    fetchProjectById();
    fetchOptions();
  }, []);

  const handleUpdateSubmit = async (e) => {
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/updateproject/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });
const res_data = await response.json();
if (!response.ok) {
      if (res_data.msg === "Name already exist") {
        setErrors({ name: res_data.msg });
      } else {
        toast.error(res_data.msg || "Something went wrong.");
      }
      return;
    }
      
        toast.success("Project updated successfully");
      
    } catch (error) {
      console.log("Update error:", error);
    }
  };
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="UPDATE PROJECT" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Project Name</Label>
                      <Input
                        name="name"
                        value={project.name}
                        onChange={handleInput}
                        placeholder="Project Name"
                        type="text"
                      />
                      {errors.name && <span className="text-danger">{errors.name}</span>}
                    </Col>

                    <Col md="6">
                      <Label>Client</Label>
                      <Select
                        options={optionscat}
                        name="client"
                        value={optionscat.find((opt) => opt.value === project.client) || null}
                        onChange={(selected) =>
                          setProject((prev) => ({
                            ...prev,
                            client: selected ? selected.value : "",
                          }))
                        }
                        isClearable
                        placeholder="Choose..."
                      />
                      {errors.client && <span className="text-danger">{errors.client}</span>}
                    </Col>

                    <Col md="6">
                      <Label>Start Date</Label>
                      <Flatpickr
                        className="form-control"
                        value={project.start_date}
                        onChange={(date) => handleDateChange(date, "start_date")}
                        options={{ dateFormat: "Y-m-d" }}
                      />
                    </Col>

                    <Col md="6">
                      <Label>End Date</Label>
                      <Flatpickr
                        className="form-control"
                        value={project.end_date}
                        onChange={(date) => handleDateChange(date, "end_date")}
                        options={{ dateFormat: "Y-m-d" }}
                      />
                    </Col>

                    <Col md="12">
                      <Label>Description</Label>
                      <Input
                        name="description"
                        type="textarea"
                        value={project.description}
                        onChange={handleInput}
                        placeholder="Project Description"
                      />
                      {errors.description && (
                        <span className="text-danger">{errors.description}</span>
                      )}
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Update
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

export default UpdateProject;
