import React from "react";
import "./style.css";
import { Header } from "../../components/Header";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";
import { useFormik } from "formik";
import * as yup from "yup";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address!")
      .required("Email is required!"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required!"),
  });

  const onSubmit = (value: any) => {
    try {
      instance
        .post("/users/login", {
          user: value,
        })
        .then((res: any) => {
          if (res.status === 200) {
            dispatch(setUser({ ...res.data.user }));
            sessionStorage.setItem("userToken", res.data.user.token);
            navigate("/");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="Login">
        <Header />
        <div className="form-header">
          <div className="title">Sign In</div>
          <Link to="/register" className="text-success">
            You Need An Account?
          </Link>
        </div>
        <div className="form-center">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
              />
              <b className="text-danger">
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""}
              </b>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
              />
              <b className="text-danger">
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""}
              </b>
            </Form.Group>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};
