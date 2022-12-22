import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { instance } from "../../httpClient";
import { setUser } from "../../stores";
import Logo from "../../assets/medium.png";
import { GoSignIn } from "react-icons/go";
import { SiGnuprivacyguard } from "react-icons/si";

export const Header = () => {
  const dataUser = useSelector((store: any) => store.user.user);
  const token = sessionStorage.getItem("userToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    instance.get("/user").then((res: any) => {
      dispatch(setUser({ ...res.data.user }));
    });
  }, []);
  return (
    <>
      <div className="header">
        <div className="header-left">
          <Link to="/" className="clearLink">
            <img src={Logo} width={"100px"} alt="" />
          </Link>
        </div>
        <div className="header-right">
          {token ? (
            <div className="Profile-Logged d-flex ">
              <div className="newPost px-1 header-right-item">
                <Link to="/editor" className="clearLink">
                  {" "}
                  <BsPencilSquare /> Write
                </Link>
              </div>
              <div
                className="d-flex"
                onClick={() =>
                  navigate(`/@${dataUser.username}`, { replace: true })
                }
              >
                <img
                  src={dataUser.image}
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle "
                  alt=""
                />
                <p className="username px-1 header-right-item">
                  {dataUser.username}
                </p>
              </div>
              <div className="setting px-1 header-right-item">
                <Link to="/settings" className="clearLink">
                  {" "}
                  <BsFillGearFill /> Settings
                </Link>
              </div>
            </div>
          ) : (
            <div className="Log-form d-flex">
              <div className="header-right-item">
                <Link to="/login" className="clearLink logBtn">
                  <GoSignIn /> Sign In
                </Link>
              </div>
              <div className="header-right-item">
                <Link to="/register" className="clearLink logBtn">
                  <SiGnuprivacyguard /> Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
