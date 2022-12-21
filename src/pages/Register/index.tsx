import React, { useState } from "react";
import { Header } from "../../components/Header";
import "./style.css";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";
export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      instance
        .post("/users", {
          user: {
            email: email,
            password: password,
            username: username,
          },
        })
        .then((res: any) => {
          // console.log("res", res);
          if (res.status === 200) {
            //console.log("data", { ...res.data.user });
            sessionStorage.setItem("userToken", res.data.user.token);
            dispatch(setUser({ ...res.data.user }));
            navigate("/");
            setUsername("");
            setEmail("");
            setPassword("");
          }
          if (res.status === 422) {
            setError(true);
            alert("Error");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="Register">
        <Header />
        <div className="form-header">
          <div className="title">Sign Up</div>
          <Link to="/login" className="text-success">
            You Have Account?
          </Link>
        </div>
        <p>{error}</p>
        <div className="form-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};
