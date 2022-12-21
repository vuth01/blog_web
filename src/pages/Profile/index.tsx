import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Header } from "../../components/Header";
import { useSelector } from "react-redux";
import { BsFillGearFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { instance } from "../../httpClient";
export const Profile = () => {
  const userData = useSelector((store: any) => store.user.user);

  // const [userData, setData] = useState<any>({});

  // useEffect(() => {
  //   instance.get("/user").then((res: any) => {
  //     setData(res.data.user);
  //   });
  // }, []);

  const navigate = useNavigate();
  return (
    <>
      <div className="Profile">
        <Header />
        <div className="profile-body">
          <div className="profile-body-header">
            <div className="profile-user">
              <img
                width={"100px"}
                height={"100px"}
                src={userData.image}
                alt="avt"
                className="rounded-circle"
              />
              <h3 className="text-center">{userData.username}</h3>
              <p className="text-center">{userData.bio}</p>
            </div>
            <div className="profile-btn">
              <button onClick={() => navigate("/settings", { replace: true })}>
                <BsFillGearFill />
                Edit Profile Settings
              </button>
            </div>
          </div>
          <div className="profile-body-main">
            <div className="profile-body-nav d-flex pt-4 pb-2">
              <div className="myArticles active px-4" tabIndex={1}>
                My Articles
              </div>
              <div className="favoriteArticles active" tabIndex={2}>
                Favorite Articles
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
