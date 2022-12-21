import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { instance } from "../../httpClient";
export const ProfileUser = () => {
  const [userData, setData] = useState<any>({});
  const { username } = useParams();
  //const [followStatus, setFollowStatus] = useState(false);
  // console.log(username);
  useEffect(() => {
    instance.get(`/profiles/${username}`).then((res: any) => {
      setData(res.data.profile);
      // setFollowStatus(res.data.profile.following);
    });
  }, []);
  //console.log(followStatus);
  const handleFollow = (item: any) => {
    const method = item.following ? "delete" : "post";
    instance[method](`/profiles/${username}/follow`).then((res: any) => {
      setData(res.data.profile);
    });
  };

  return (
    <>
      <div className="Profile-user">
        <Header />
        <div className="profile-body">
          <div className="profile-body-header">
            <div className="profile-user">
              <img
                width={"100px"}
                height={"100px"}
                src={userData.image}
                alt="avt"
                className="rounded-circle d-block mx-auto"
              />
              <h3 className="text-center">{userData.username}</h3>
              <p className="text-center">{userData.bio}</p>
            </div>
            <div className="profile-btn">
              <button onClick={() => handleFollow(userData)}>
                <FaPlus />
                {userData.following ? (
                  <span>Unfollow</span>
                ) : (
                  <span>Follow</span>
                )}{" "}
                {userData.username}
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
