import React, { useState } from "react";
import "./style.css";
import { Header } from "../../components/Header";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      instance
        .post("/users/login", {
          user: {
            email: email,
            password: password,
          },
        })
        .then((res: any) => {
          if (res.status === 200) {
            dispatch(setUser({ ...res.data.user }));
            sessionStorage.setItem("userToken", res.data.user.token);
            navigate("/");
            setEmail("");
            setPassword("");
            setError("");
          }
          if (res.status !== 200) {
            setError("Error");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

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
        <p>{error}</p>
        <div className="form-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
              {/* <Form.Text className="text-muted">Error</Form.Text> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
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
