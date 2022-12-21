import React from "react";
import { instance } from "../../httpClient";
export const Profile = () => {
  const getUser = () => {
    instance.get("/user").then((res: any) => {
      console.log(res.data);
    });
  };
  const login = () => {
    instance
      .post("/users/login", {
        user: {
          email: "hai@hai.com",
          password: "123456",
        },
      })
      .then((res: any) => {
        console.log(res);
        sessionStorage.setItem("userToken", res.data.user.token);
      });
  };

  //logout: remove token , navigate to login

  return (
    <>
      <h2>profile</h2>
      <button onClick={getUser}>Click</button>
      <button onClick={login}>Login</button>
    </>
  );
};
