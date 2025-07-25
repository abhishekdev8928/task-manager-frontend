import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Container,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";

const Profile = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: "",
    emp_id: "",
  });

  const [user, setUser] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Profile", link: "#" },
  ];

  const id = localStorage.getItem("adminid");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/employee/getemployeeByid/${id}`
        );
        const res_data = await response.json();

        if (response.ok) {
          const packageData = res_data.msg;
          setEmployee({
            name: packageData.name || "",
            email: packageData.email || "",
            role: packageData.role || "",
            emp_id: packageData.emp_id || "",
            profile_pic: packageData.profile_pic || "", // ✅ THIS LINE ADDED
          });
        } else {
          console.error("Employee not found");
        }
      } catch (error) {
        console.error("Fetch employee error:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  // Update submission
  const handleinput = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleinput2 = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!employee.name) newErrors.name = "Name is required";
    if (!employee.email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("email", employee.email);

      formDataToSend.append("name", employee.name);

      if (selectedFile) {
        formDataToSend.append("profile_pic", selectedFile);
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/profile/editprofile/${id}`,
        {
          method: "PATCH",
          body: formDataToSend,
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

      toast.success("Profile updated successfully");

      setSelectedFile(null);
      setErrors({});
    } catch (error) {
      console.log("Update error:", error);
    }
  };

 const handleUpdatePass = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!user.current_password)
    newErrors.current_password = "Current Password is required";
  if (!user.new_password) newErrors.new_password = "New Password is required";
  if (!user.confirm_password)
    newErrors.confirm_password = "Confirm Password is required";

  if (
    user.new_password &&
    user.confirm_password &&
    user.new_password !== user.confirm_password
  ) {
    newErrors.confirm_password = "Passwords do not match";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/profile/updatepassword/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );

    const res_data = await response.json();
    console.log("res_data from server:", res_data); // ✅

    if (!response.ok) {
      if (res_data.msg === "wrong_password") {
        setErrors({ current_password: "Current password is incorrect" });
      } else if (res_data.msg) {
        toast.error(res_data.msg);
      } else if (res_data.error) {
        toast.error(res_data.error);
      } else {
        toast.error("Something went wrong.");
      }
      return;
    }

    toast.success("Password updated successfully");
    setUser({ current_password: "", new_password: "", confirm_password: "" });
    setErrors({});
  } catch (error) {
    console.error("Update error:", error);
    toast.error("An error occurred.");
  }
};


  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="PROFILE" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="6">
            <Card className="">
              <CardBody>
                <h2 className="card-title fs-5 mb-4">Profile Page</h2>
                <form
                  className="needs-validation"
                  onSubmit={handleUpdateSubmit}
                >
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="name">
                          Name
                        </Label>
                        <Input
                          name="name"
                          placeholder="Name"
                          type="text"
                          value={employee.name}
                          onChange={handleinput}
                        />
                        {errors.name && (
                          <div className="text-danger">{errors.name}</div>
                        )}
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="email">
                          Email
                        </Label>
                        <Input
                          name="email"
                          placeholder="Email"
                          type="email"
                          value={employee.email}
                          onChange={handleinput}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label">Profile Pic</Label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            name="profile_pic"
                            onChange={handleFileChange}
                            id="customFile"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="input-group">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/profile/${employee.profile_pic}`}
                            alt="Profile"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Col>

          {/* Reset Password Card */}
          <Col xl="6">
            <Card className="">
              <CardBody>
                <h2 className="card-title fs-5 mb-4">Reset Password</h2>
                <form onSubmit={handleUpdatePass} className="needs-validation">
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="currentPass">
                          Current Password
                        </Label>
                        <Input
                          type="password"
                          id="currentPass"
                          name="current_password"
                          value={user.current_password}
                          onChange={handleinput2}
                        />
                        {errors.current_password && (
                          <div className="text-danger">
                            {errors.current_password}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="newPass">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          id="newPass"
                          name="new_password"
                          value={user.new_password}
                          onChange={handleinput2}
                        />
                        {errors.new_password && (
                          <div className="text-danger">
                            {errors.new_password}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="confirmPass">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          id="confirmPass"
                          name="confirm_password"
                          value={user.confirm_password}
                          onChange={handleinput2}
                        />
                        {errors.confirm_password && (
                          <div className="text-danger">
                            {errors.confirm_password}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">
                    Reset
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

export default Profile;
