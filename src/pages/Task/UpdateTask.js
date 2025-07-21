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
const AddTask = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Task", link: "#" },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    frequency: "",
    task_status: "",
    priority: "",
    assignto: [],
    client: "",
    project: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [clientOptions, setClientOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const { id } = useParams(); // Now valid
  const fetchTaskById = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/gettaskByid/${id}`
      );
      const data = await res.json();
      if (res.ok) {
        const item = data.msg;
        setFormData({
          title: item.title || "",
          priority: item.priority || "",
          assignto: item.assignto || "",
          project: item.project || "",
          task_status: item.task_status || "",
          frequency: item.frequency || "",
          client: item.client || "",
          description: item.description || "",
          start_date: item.start_date?.split("T")[0] || "",
          end_date: item.end_date?.split("T")[0] || "",
          filePath: item.filePath || "", // ✅ THIS LINE ADDED
        });
      } else {
        toast.error("Failed to load project");
      }
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  useEffect(() => {
    fetchTaskById();
    fetchClientOptions();
    fetchProjectOptions();
    fetchEmployeeOptions();
  }, []);

  const fetchClientOptions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/task/categoryOptions`);
      const data = await res.json();
      const options = (data.msg || []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setClientOptions(options);
    } catch (err) {
      console.error("Error fetching client options:", err);
    }
  };

  const fetchProjectOptions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/task/projectOptions`);
      const data = await res.json();
      const options = (data.msg || []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setProjectOptions(options);
    } catch (err) {
      console.error("Error fetching project options:", err);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/task/employeeOptions`);
      const data = await res.json();
      const options = (data.msg || []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setEmployeeOptions(options);
    } catch (err) {
      console.error("Error fetching employee options:", err);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDates, name) => {
    const formattedDate = selectedDates[0].toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, [name]: formattedDate }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

 const handleAddSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!formData.title) newErrors.title = "Title is required";
  if (!formData.frequency) newErrors.frequency = "Frequency is required";
  if (!formData.task_status) newErrors.task_status = "Status is required";
  if (!formData.start_date) newErrors.start_date = "Start Date is required";
  if (!formData.end_date) newErrors.end_date = "End Date is required";
  if (!formData.priority) newErrors.priority = "Priority is required";
  if (!formData.assignto.length) newErrors.assignto = "Assigned To is required";
  if (!formData.client) newErrors.client = "Client is required";
  if (!formData.project) newErrors.project = "Project is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("frequency", formData.frequency);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("start_date", formData.start_date);
    formDataToSend.append("end_date", formData.end_date);
    formDataToSend.append("task_status", formData.task_status);
    formDataToSend.append("client", formData.client);
    formDataToSend.append("project", formData.project);
    formDataToSend.append("description", formData.description);
      formDataToSend.append("assignto", JSON.stringify(formData.assignto));

    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/task/updatetask/${id}`, {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.msg || "Failed to update task.");
      return;
    }

    toast.success("Task Updated Successfully");
    // ✅ Do not reset formData; only clear selected file
    setSelectedFile(null);
    setErrors({});
    // Optionally re-fetch task to get updated file path
    fetchTaskById(); // ← add this if needed
  } catch (err) {
    console.error("Update Task Error:", err);
  }
};


  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="UPDATE TASK" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Task Title</Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="Task Title"
                        type="text"
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Frequency</Label>
                      <Input
                        type="select"
                        name="frequency"
                        onChange={handleInput}
                        value={formData.frequency}
                      >
                        <option value="">Select</option>
                        <option value="One-time">One-time</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Continuous">Continuous</option>
                      </Input>
                      {errors.frequency && (
                        <span className="text-danger">{errors.frequency}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Start Date</Label>
                      <Flatpickr
                        className="form-control"
                        value={formData.start_date}
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
                      <Label>Deadline</Label>
                      <Flatpickr
                        className="form-control"
                        value={formData.end_date}
                        onChange={(date) => handleDateChange(date, "end_date")}
                        options={{ dateFormat: "Y-m-d" }}
                      />
                      {errors.end_date && (
                        <span className="text-danger">{errors.end_date}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Attachments</Label>
                      <Input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="form-control"
                      />
                    </Col>

                    <Col md="6">
                      <div className="mb-2">
                        <a

                          href={`${process.env.REACT_APP_API_BASE_URL}/attchment/${formData.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </div>
                    </Col>

                    <Col md="6">
                      <Label>Status</Label>
                      <Input
                        type="select"
                        name="task_status"
                        onChange={handleInput}
                        value={formData.task_status}
                      >
                        <option value="">Select</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In-Process">In-Process</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Complete">Complete</option>
                        <option value="Delayed">Delayed</option>
                      </Input>
                      {errors.task_status && (
                        <span className="text-danger">
                          {errors.task_status}
                        </span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Priority</Label>
                      <Input
                        type="select"
                        name="priority"
                        onChange={handleInput}
                        value={formData.priority}
                      >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Input>
                      {errors.priority && (
                        <span className="text-danger">{errors.priority}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Assigned To</Label>
                      <Select
                        isMulti
                        name="assignto"
                        options={employeeOptions}
                        value={employeeOptions.filter((opt) =>
                          formData.assignto.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFormData((prev) => ({
                            ...prev,
                            assignto: selectedOptions.map((opt) => opt.value),
                          }))
                        }
                        placeholder="Choose..."
                      />
                      {errors.assignto && (
                        <span className="text-danger">{errors.assignto}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Client</Label>
                      <Select
                        options={clientOptions}
                        name="client"
                        value={
                          clientOptions.find(
                            (opt) => opt.value === formData.client
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            client: selected ? selected.value : "",
                          }))
                        }
                        isClearable
                        placeholder="Choose..."
                      />
                      {errors.client && (
                        <span className="text-danger">{errors.client}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Project</Label>
                      <Select
                        options={projectOptions}
                        name="project"
                        value={
                          projectOptions.find(
                            (opt) => opt.value === formData.project
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            project: selected ? selected.value : "",
                          }))
                        }
                        isClearable
                        placeholder="Choose..."
                      />
                      {errors.project && (
                        <span className="text-danger">{errors.project}</span>
                      )}
                    </Col>

                    <Col md="12">
                      <Label>Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleInput}
                        placeholder="Description"
                      />
                    </Col>
                  </Row>

                  <Button type="submit" color="primary" className="mt-3">
                    Update Task
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

export default AddTask;
