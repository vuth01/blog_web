import React, { useEffect, useState } from "react";
import "./article.css";
import { Header } from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import axios from "axios";
import { instance } from "../../httpClient";
import { Comment } from "../../components/Comment";
import { RiChatDeleteLine } from "react-icons/ri";
import { useSelector } from "react-redux";

export const Article = () => {
  const dataUser = useSelector((store: any) => store.user.user);
  const token = sessionStorage.getItem("userToken");
  const [article, setArticle] = useState<any>({});
  const { slug } = useParams();
  const [followStatus, setFollowStatus] = useState(false);
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const [listComments, setListComments] = useState<any>([]);

  useEffect(() => {
    if (!token) {
      axios
        .get(`https://api.realworld.io/api/articles/${slug}`)
        .then((res: any) => {
          setArticle(res.data.article);
        });
    } else {
      instance
        .get(`/articles/${slug}`)
        .then((res: any) => {
          setArticle(res.data.article);
          setUser(res.data.article.author);
          setFollowStatus(res.data.article.author.following);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [slug, token]);

  useEffect(() => {
    if (token) {
      instance.get(`/articles/${slug}/comments`).then((res: any) => {
        setListComments([...res.data.comments]);
      });
    } else {
      axios
        .get(`https://api.realworld.io/api/articles/${slug}/comments`)
        .then((res: any) => {
          setListComments([...res.data.comments]);
        });
    }
  }, [slug, token]);

  //console.log(listComments);

  const handleFollow = () => {
    if (token) {
      if (followStatus) {
        instance.delete(`/profiles/${user}/follow`).then((res: any) => {
          setFollowStatus(res.data.profile.following);
        });
      } else {
        instance
          .post(`/profiles/${user}/follow`, {
            profile: {
              username: user.username,
              bio: user.bio,
              image: user.image,
              following: true,
            },
          })
          .then((res: any) => {
            setFollowStatus(res.data.profile.following);
          });
      }
    } else {
      navigate("/login");
    }
  };

  const handleFavorite = (item: any) => {
    if (!token) {
      navigate("/login");
    } else {
      const slug = item.slug;
      const index = article.indexOf(item);
      const method = article.favorited ? "delete" : "post";
      instance[method](`/articles/${slug}/favorite`).then((res: any) => {
        article[index] = res.data.article;
        setArticle([...article]);
      });
    }
  };

  const handleDeleteComment = (item: any) => {
    const id = item.id;
    instance.delete(`/articles/${slug}/comments/${id}`).then((res: any) => {
      const cmt = listComments.filter((item: any) => item.id !== id);
      setListComments(cmt);
    });
  };

  return (
    <>
      <Header />
      <div className="Article">
        <div className="article-header">
          <div className="article-header-title pb-2">
            <h1>{article?.title}</h1>
          </div>
          <div className="article-header-user d-flex">
            <div className="article-header-user-left d-flex align-items-center">
              <div className="post-user-img ">
                <img
                  width={"32px"}
                  height={"32px"}
                  src={article?.author?.image}
                  className="rounded-circle"
                  alt=""
                />
              </div>
              <div className="article-user-name pb-3">
                <b
                  onClick={() =>
                    navigate(`/profile/${article?.author?.username}`)
                  }
                >
                  {article?.author?.username}
                </b>
                {/* 2022-12-15T07:25:21.907Z */}
                <p className="post-time">
                  {moment(
                    article?.createdAt?.replace(/\.\w+$/, ""),
                    "YYYY-MM-DDTHH:mm:ss"
                  ).format("MMM Do YY")}
                </p>
              </div>
            </div>
            <div className="article-header-user-right d-flex align-items-center px-4">
              <button className="btnFollow" onClick={() => handleFollow()}>
                <FaPlus /> <span>{followStatus ? "Unfollow" : "Follow"}</span>{" "}
                <span>{article?.author?.username}</span>
              </button>
              <button
                className={
                  article?.favorited
                    ? "btnFavorite activeFavorite"
                    : "btnFavorite"
                }
                onClick={() => handleFavorite(article)}
              >
                <BsHeartFill /> <span>Favorite Article</span> {"("}{" "}
                <span>{article?.favoritesCount}</span> {")"}
              </button>
            </div>
          </div>
        </div>
        <div className="article-content">
          <div className="article-content-main">{article?.body}</div>
          <div className="article-content-tag">
            {article?.tagList?.map((item: any, index: number) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
        <div className="article-comment">
          <div className="list-comments">
            {listComments.length > 0
              ? listComments.map((item: any, index: number) => (
                  <div
                    className="comments-item d-flex aligns-items-center mb-4"
                    key={index}
                  >
                    <div className="comments-item-left d-flex justify-content-center aligns-items-center ">
                      <img
                        src={item.author.image}
                        alt="avt"
                        className="rounded-circle"
                        width={"40px"}
                        height={"40px"}
                      />
                      <div className="d-flex flex-column justify-content-center">
                        <b className="px-2 font-weight-bold">
                          {item.author.username}
                        </b>
                        <span className="time-comment">
                          {moment(item.updatedAt).startOf("second").fromNow()}
                        </span>
                      </div>
                    </div>
                    <div className="comment-item-right px-2 d-flex justify-content-center aligns-items-center">
                      <p className="d-flex justify-content-center align-item-center">
                        {item.body}
                      </p>

                      <div
                        className="comment-delete-icon px-2"
                        onClick={() => handleDeleteComment(item)}
                      >
                        {item.author.username === dataUser.username ? (
                          <RiChatDeleteLine />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : "This post has no comment"}
          </div>
          <div className="article-post-comment">
            <Comment
              slug={slug}
              listComments={listComments}
              setListComments={setListComments}
            />
          </div>
        </div>
      </div>
    </>
  );
};
