import React, { useState } from "react";
import {
  Row, Col, Card, CardBody, Button, Label, Input, Container
} from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { toast } from 'react-toastify';

const AddClient = () => {
  const [client, setClient] = useState({
    name: "",
    email: "",
    companyname: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Client", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!client.name) newErrors.name = 'Name is required';
    if (!client.email) newErrors.email = 'Email is required';
    if (!client.companyname) newErrors.companyname = 'Company name is required';
    if (!client.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/client/addclient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, createdBy: adminid }), // ✅ Correct

      });
      const res_data = await response.json();

      if (!response.ok) {
        if (res_data.msg === "Email already exist") {
          setErrors({ email: res_data.msg });
        } else {
          toast.error(res_data.msg || "Something went wrong.");
        }
        return;
      }

      toast.success("Client Added successfully!");
      setErrors({});
      setClient({ name: "", email: "", companyname: "", phone: "", notes: "" });
    } catch (error) {
      console.log("Add Client error:", error);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD CLIENT" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Company Name</Label>
                      <Input
                        name="companyname"
                        type="text"
                        placeholder="Company Name"
                        value={client.companyname}
                        onChange={handleInput}
                      />
                      {errors.companyname && <span className="text-danger">{errors.companyname}</span>}
                    </Col>
                    <Col md="6">
                      <Label>Contact Person</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={client.name}
                        onChange={handleInput}
                      />
                      {errors.name && <span className="text-danger">{errors.name}</span>}
                    </Col>
                    <Col md="6">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={client.email}
                        onChange={handleInput}
                      />
                      {errors.email && <span className="text-danger">{errors.email}</span>}
                    </Col>
                    <Col md="6">
                      <Label>Phone</Label>
                      <Input
                        name="phone"
                        type="text"
                        placeholder="Phone"
                        value={client.phone}
                        onChange={handleInput}
                      />
                      {errors.phone && <span className="text-danger">{errors.phone}</span>}
                    </Col>
                    <Col md="12">
                      <Label>Notes</Label>
                      <Input
                        name="notes"
                        type="textarea"
                        placeholder="Notes"
                        value={client.notes}
                        onChange={handleInput}
                      />
                    </Col>
                  </Row>
                  <Button color="primary" type="submit" className="mt-3">Add</Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddClient;
