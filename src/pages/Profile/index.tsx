import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Header } from "../../components/Header";
import { useSelector } from "react-redux";
import { BsFillGearFill, BsHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { instance } from "../../httpClient";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import { Pagination } from "../../components/Pagination";
export const Profile = () => {
  const userData = useSelector((store: any) => store.user.user);
  const author = userData.username;
  const [data, setData] = useState<any>([]);
  const [myArticle, setMyArticle] = useState<any>([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (!isClicked) {
      instance
        .get("/articles", {
          params: {
            author: author,
          },
        })
        .then((res: any) => {
          setMyArticle(res.data.articles);
        });
    } else {
      instance
        .get("/articles", {
          params: {
            favorited: author,
          },
        })
        .then((res: any) => {
          setMyArticle(res.data.articles);
        });
    }
  }, [author, isClicked]);
  // console.log(myArticle);

  const navigate = useNavigate();
  const handleNavigate = (user: any) => {
    if (userData.username === user) {
      navigate(`/@${user}`);
    } else {
      navigate(`/profile/${user}`);
    }
  };

  const handlePostNavigate = (item: any) => {
    const username = item.author.username;
    const slug = item.slug;
    console.log(username);
    if (username === userData.username) {
      navigate(`/articles/edit/${slug}`);
    } else {
      navigate(`/articles/${slug}`);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = myArticle.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  const handleFavorite = (item: any) => {
    const slug = item.slug;
    const index = data.indexOf(item);
    const method = item.favorited ? "delete" : "post";
    instance[method](`/articles/${slug}/favorite`).then((res: any) => {
      data[index] = res.data.article;
      setData([...data]);
    });
  };

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
            <div className="profile-body-nav d-flex pt-4">
              <div
                className={
                  isClicked
                    ? "myArticles active px-4"
                    : "myArticles active px-4"
                }
                tabIndex={1}
                onClick={() => setIsClicked(false)}
              >
                My Articles
              </div>
              <div
                className={
                  isClicked
                    ? "myArticles active px-4"
                    : "myArticles active px-4"
                }
                tabIndex={2}
                onClick={() => setIsClicked(true)}
              >
                Favorite Articles
              </div>
            </div>
          </div>
          <div className="article-container">
            {currentPosts.length > 0 ? (
              currentPosts.map((item: any) => (
                <div className="myArticle" key={item.slug}>
                  <div className="post-main py-4">
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
                          className={item?.favorited ? "activeFavorite" : ""}
                          onClick={() => handleFavorite(item)}
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
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center align-item-center mt-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
          </div>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={myArticle.length}
            paginate={paginate}
          />
        </div>
      </div>
    </>
  );
};
