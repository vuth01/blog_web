import moment from "moment";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { BsHeartFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { instance } from "../../httpClient";
export const ProfileUser = () => {
  const currentUser = useSelector((store: any) => store.user.user);
  const token = sessionStorage.getItem("userToken");
  const [userData, setData] = useState<any>({});
  const { username } = useParams();
  const [data, setDataArticle] = useState<any>([]);
  const [isClicked, setIsClicked] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  useEffect(() => {
    instance.get(`/profiles/${username}`).then((res: any) => {
      setData(res.data.profile);
      // setFollowStatus(res.data.profile.following);
    });
  }, [username]);

  useEffect(() => {
    if (!isClicked) {
      instance
        .get("/articles", {
          params: {
            author: username,
          },
        })
        .then((res: any) => {
          console.log(res.data);
          setDataArticle(res.data.articles);
        });
    } else {
      instance
        .get("/articles", {
          params: {
            favorited: username,
          },
        })
        .then((res: any) => {
          console.log(res.data);
          setDataArticle(res.data.articles);
        });
    }
  }, [username, isClicked]);

  //console.log(followStatus);
  const handleFollow = (item: any) => {
    const method = item.following ? "delete" : "post";
    instance[method](`/profiles/${username}/follow`).then((res: any) => {
      setData(res.data.profile);
    });
  };

  const navigate = useNavigate();
  const handleNavigate = (user: any) => {
    if (!token) {
      navigate("/login");
    } else {
      if (currentUser.username === user) {
        navigate(`/@${user}`);
      } else {
        navigate(`/profile/${user}`);
      }
    }
  };

  const handlePostNavigate = (item: any) => {
    console.log(item);
    const username = item.author.username;
    const slug = item.slug;
    console.log(username);
    if (username === currentUser.username) {
      navigate(`/articles/edit/${slug}`);
    } else {
      navigate(`/articles/${slug}`);
    }
  };

  const handleFavorite = (item: any) => {
    if (!token) {
      navigate("/login");
    } else {
      const slug = item.slug;
      const index = data.indexOf(item);
      const method = item.favorited ? "delete" : "post";
      instance[method](`/articles/${slug}/favorite`).then((res: any) => {
        data[index] = res.data.article;
        setData([...data]);
      });
    }
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
            <div className="profile-body-nav d-flex pt-4">
              <div
                style={{ backgroundColor: "#fff" }}
                className={
                  isClicked
                    ? "myArticles active px-4"
                    : "myArticles active onActiveStart px-4"
                }
                tabIndex={1}
                onClick={() => setIsClicked(false)}
              >
                My Articles
              </div>
              <div
                className="favoriteArticles active"
                tabIndex={2}
                onClick={() => setIsClicked(true)}
              >
                Favorite Articles
              </div>
            </div>
            <div className="article-user">
              {currentPosts.length > 0 ? (
                currentPosts.map((item: any, index: any) => (
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
                ))
              ) : (
                <div className="d-flex justify-content-center align-item-center mt-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>
          </div>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={data.length}
            paginate={paginate}
          />
        </div>
      </div>
    </>
  );
};
