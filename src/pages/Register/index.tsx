import React from "react";
import { Header } from "../../components/Header";
import "./style.css";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";
import { useFormik } from "formik";
import * as yup from "yup";

export const Register = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  // const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   try {
  //     instance
  //       .post("/users", {
  //         user: {
  //           email: email,
  //           password: password,
  //           username: username,
  //         },
  //       })
  //       .then((res: any) => {
  //         if (res.status === 200) {
  //           sessionStorage.setItem("userToken", res.data.user.token);
  //           dispatch(setUser({ ...res.data.user }));
  //           navigate("/");
  //           setUsername("");
  //           setEmail("");
  //           setPassword("");
  //         }
  //         if (res.status === 422) {
  //           setError(true);
  //         }
  //       });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address!")
      .required("Email is required!"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required!"),
    username: yup
      .string()
      .min(5, "Username is too short!")
      .max(20, "Username is too long!")
      .required("Username is required!"),
  });

  const onSubmit = (value: any) => {
    console.log(value);
    try {
      instance
        .post("/users", {
          user: value,
        })
        .then((res: any) => {
          if (res.status === 200) {
            sessionStorage.setItem("userToken", res.data.user.token);
            dispatch(setUser({ ...res.data.user }));
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
      username: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="Register">
        <Header />
        <div className="form">
          <div className="form-header">
            <div className="title">Sign Up</div>
            <Link to="/login" className="text-success">
              You Have Account?
            </Link>
          </div>
          <div className="form-center">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formik.values.username}
                  placeholder="Username"
                  onChange={formik.handleChange}
                />
                <b className="text-danger">
                  {formik.touched.username && formik.errors.username
                    ? formik.errors.username
                    : ""}
                </b>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  placeholder="Enter email"
                  onChange={formik.handleChange}
                />
                <b className="text-danger">
                  {formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""}
                </b>
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formik.values.password}
                  placeholder="Password"
                  onChange={formik.handleChange}
                />
                <b className="text-danger">
                  {formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ""}
                </b>
              </Form.Group>
              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
