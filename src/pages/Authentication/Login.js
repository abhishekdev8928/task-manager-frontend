import React from "react";
import { Row, Col, Input, Button, Alert, Container, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import logodark from "../../assets/images/diigii.webp";
import logolight from "../../assets/images/diigii.webp";

const LoginForm = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token);
        localStorage.setItem("adminid", res_data.user.id);
        localStorage.setItem("role", res_data.user.role);
        localStorage.setItem("email", res_data.user.email);

        console.log("res_data", res_data.user.id);
        console.log("res_data", res_data.user.role);
        localStorage.setItem("otpemail", JSON.stringify(res_data.email));
        toast.success("Email and Password Verified Successfully");

        navigate("/dashboard");
      } else {
        if (res_data.extraDetails?.toLowerCase().includes("password")) {
          setErrors({ password: res_data.extraDetails });
        } else {
          setErrors({ submit: res_data.message || "Login failed" });
        }
      }
    } catch (error) {
      setErrors({ submit: "Server error. Please try again later." });
    }
    setSubmitting(false);
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col lg={4}>
          <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
            <div className="w-100">
              <Row className="justify-content-center">
                <Col lg={9}>
                  <div>
                    <div className="text-center">
                      <Link to="/">
                        <img
                          src={logodark}
                          height="35"
                          className="auth-logo logo-dark mx-auto"
                          alt="dark"
                        />
                        <img
                          src={logolight}
                          height="35"
                          className="auth-logo logo-light mx-auto"
                          alt="light"
                        />
                      </Link>
                      <h4 className="font-size-18 mt-4">Welcome Back!</h4>
                      <p className="text-muted">
                        Sign in to continue to DiigiiHost.
                      </p>
                    </div>

                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                      }) => (
                        <form
                          className="form-horizontal"
                          onSubmit={handleSubmit}
                        >
                          <div className="auth-form-group-custom mb-4">
                            <i className="ri-user-2-line auti-custom-input-icon"></i>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                            />
                            {touched.email && errors.email && (
                              <small className="text-danger">
                                {errors.email}
                              </small>
                            )}
                          </div>

                          <div className="auth-form-group-custom mb-4">
                            <i className="ri-lock-2-line auti-custom-input-icon"></i>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              type="password"
                              name="password"
                              placeholder="Enter Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                            />
                            {touched.password && errors.password && (
                              <small className="text-danger">
                                {errors.password}
                              </small>
                            )}
                          </div>

                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="rememberMe"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="rememberMe"
                            >
                              Remember me
                            </Label>
                          </div>

                          <div className="mt-4 text-center">
                            <Button
                              color="primary"
                              className="w-md"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Log In
                            </Button>
                          </div>

                          {errors.submit && (
                            <div className="mt-2 text-danger text-center">
                              {errors.submit}
                            </div>
                          )}

                          <div className="mt-4 text-center">
                            <Link to="/forgot-password" className="text-muted">
                              <i className="mdi mdi-lock me-1"></i> Forgot your
                              password?
                            </Link>
                          </div>
                        </form>
                      )}
                    </Formik>

                    <div className="mt-5 text-center">
                      <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="fw-medium text-primary">
                          Register
                        </Link>
                      </p>
                      <p>
                        © {new Date().getFullYear()}{" "}
                        <a
                          href="https://www.digihost.in/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          DiigiiHost
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <div className="authentication-bg">
            <div className="bg-overlay"></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
