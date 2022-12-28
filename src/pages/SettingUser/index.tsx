import React, { useEffect, useState } from "react";
import "./settingUser.css";
import { Header } from "../../components/Header";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const SettingUser = () => {
  const dataUser = useSelector((store: any) => store.user.user);

  const [image, setImage] = useState(dataUser.image);
  const [username, setUsername] = useState(dataUser.username);
  const [bio, setBio] = useState(dataUser.bio);
  const [email, setEmail] = useState(dataUser.email);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(dataUser.image);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      instance
        .put("/user", {
          user: {
            email: email,
            password: password,
            username: username,
            bio: bio,
            image: image,
          },
        })
        .then((res: any) => {
          if (res.status === 200) {
            dispatch(setUser({ ...res.data.user }));
            sessionStorage.setItem("userToken", res.data.user.token);
            navigate(`/@${username}`);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  const handleLogOut = () => {
    sessionStorage.removeItem("userToken");
    navigate("/");
  };

  useEffect(() => {
    setAvatar(image);
  }, [image]);

  return (
    <>
      <div className="Settings">
        <Header />
        <div className="setting-title text-center pt-4">
          <h1>Your Profile</h1>
        </div>
        <div className="setting-avatar d-flex justify-content-center">
          <img src={avatar} alt="" />
        </div>
        <div className="setting-form">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Image:</Form.Label>
              <Form.Control
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Your bio:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>New Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="success" type="submit" className="">
                Update Settings
              </Button>
            </div>
          </Form>
          <Button
            variant="outline-danger"
            type="submit"
            className=""
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
};
