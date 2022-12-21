import React, { useEffect, useState } from "react";
import "./style.css";
import { Header } from "../../components/Header";
import { Tag } from "../../components/Tag";
import { BsHeartFill } from "react-icons/bs";
import { instance } from "../../httpClient";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export const Home = () => {
  const currentUser = useSelector((store: any) => store.user.user);
  const token = sessionStorage.getItem("userToken");
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    if (!token) {
      axios
        .get("https://api.realworld.io/api/articles", {
          params: { limit: 20, offset: 0 },
        })
        .then((res: any) => {
          setData(res.data.articles);
        });
    } else {
      instance
        .get("/articles", { params: { limit: 20, offset: 0 } })
        .then((res: any) => {
          setData(res.data.articles);
        });
    }
  }, []);

  // console.log(data);
  const navigate = useNavigate();
  const handleNavigate = (user: any) => {
    if (currentUser.username === user) {
      navigate(`/@${user}`);
    } else {
      navigate(`/profile/${user}`);
    }
  };

  const handlePostNavigate = (item: any) => {
    console.log(item);
    const username = item.author.username;
    const slug = item.slug;
    console.log(username);
    if (username === currentUser.username) {
      navigate(`articles/edit/${slug}`);
    } else {
      navigate(`articles/${slug}`);
    }
  };

  const handleFavorite = (item: any) => {
    if (!token) {
      navigate("/login");
    } else {
      const slug = item.slug;
      //console.log(item);
      const index = data.indexOf(item);
      const method = item.favorited ? "delete" : "post";
      instance[method](`/articles/${slug}/favorite`).then((res: any) => {
        //console.log(res.data);
        data[index] = res.data.article;
        setData([...data]);
      });
    }
  };

  return (
    <>
      <div className="Home">
        <Header />
        <div className="home-container">
          {token ? (
            ""
          ) : (
            <div className="banner">
              <div className="title">
                <h1>Logo</h1>
                <p>A place to share your knowledge.</p>
              </div>
            </div>
          )}
          <div className="feed-container pt-4 mx-1">
            <div className="main-feed">
              <div className="nav-feed">
                <div className="profile-body-nav d-flex pt-4 pb-2 mx-2">
                  <div className="myArticles active px-4" tabIndex={1}>
                    Global Feed
                  </div>
                  {token ? (
                    <div className="favoriteArticles active" tabIndex={2}>
                      Your Feed
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="all-post-container mt-4">
                {data.map((item: any, index: any) => (
                  <div className="post-main py-4" key={index}>
                    <div className="post-header d-flex justify-content-between align-items-center">
                      <div className="post-header-left d-flex align-items-center">
                        <div className="post-user-img">
                          <img
                            width={"32px"}
                            height={"32px"}
                            src={item?.author?.image}
                            className="rounded-circle mx-2"
                            alt=""
                          />
                        </div>
                        <div
                          className="post-user-name"
                          onClick={() => handleNavigate(item.author.username)}
                        >
                          <b>{item?.author?.username}</b>
                          <p className="post-time">
                            {moment(
                              item?.createdAt?.replace(/\.\w+$/, ""),
                              "YYYY-MM-DDTHH:mm:ss"
                            ).format("MMM Do YY")}
                          </p>
                        </div>
                      </div>
                      <div className="post-header-right">
                        <button
                          onClick={() => handleFavorite(item)}
                          className={item?.favorited ? "activeFavorite" : ""}
                        >
                          {" "}
                          <BsHeartFill /> {item?.favoritesCount}
                        </button>
                      </div>
                    </div>
                    <div
                      className="post-content py-3"
                      onClick={() => handlePostNavigate(item)}
                    >
                      <div className="post-content-title">
                        <h3>{item?.title}</h3>
                      </div>
                      <div className="post-content-description">
                        {item?.description}
                      </div>
                    </div>
                    <div className="post-tagMore d-flex justify-content-between align-items-center">
                      <div className="post-tagMore-left">Readmore...</div>
                      <div className="post-tagMore-right">
                        {item?.tagList.map((item: any, index: any) => (
                          <button className="mx-2" key={index}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="main-tag">
              <Tag />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
