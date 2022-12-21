import moment from "moment";
import "./articleEdit.css";
import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { BsPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Comment } from "../../components/Comment";
import { ModalPopUp } from "../../components/ModalPopUp";
export const ArticleEdit = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState<any>({});
  const [listComment, setListComment] = useState<any>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    axios
      .get(`https://api.realworld.io/api/articles/${slug}`)
      .then((res: any) => {
        setArticle(res.data.article);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://api.realworld.io/api/articles/${slug}/comments`)
      .then((res: any) => {
        setListComment(res.data.comments);
      });
  }, []);

  const handleEditArticle = () => {};

  const handleDeleteArticle = () => {
    setIsDeleted(!isDeleted);
  };

  return (
    <>
      <Header />
      <div className="article-edit">
        <div className="article-header">
          <div className="article-header-title pb-2">
            <h1>{article?.title}</h1>
          </div>
          <div className="article-header-user d-flex">
            <div className="article-header-user-left d-flex align-items-center">
              <div className="post-user-img d-flex align-items-center">
                <img
                  width={"32px"}
                  height={"32px"}
                  src={article?.author?.image}
                  className="rounded-circle"
                  alt=""
                />
              </div>
              <div className="article-user-name ">
                <b>{article?.author?.username}</b>
                <p className="post-time">
                  {moment(
                    article?.createdAt?.replace(/\.\w+$/, ""),
                    "YYYY-MM-DDTHH:mm:ss"
                  ).format("MMM Do YY")}
                </p>
              </div>
            </div>
            <div className="article-header-user-right d-flex align-items-center px-4">
              <button
                className="article-edit-btn"
                onClick={() => handleEditArticle}
              >
                <BsPencilFill /> Edit Article
              </button>
              <button
                className="article-delete-btn "
                onClick={() => handleDeleteArticle}
              >
                <FaTrash /> Delete Article
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
            {listComment.length > 0 ? (
              listComment.map((item: any, index: number) => (
                <div
                  className="comments-item d-flex aligns-items-center mb-4"
                  key={index}
                >
                  <div className="comments-item-left">
                    <img
                      src={item.author.image}
                      alt="avt"
                      className="rounded-circle"
                      width={"30px"}
                      height={"30px"}
                    />
                    <b className="px-2 font-weight-bold">
                      {item.author.username}
                    </b>
                  </div>
                  <div className="comment-item-right px-2 d-flex justify-content-between align-item-center">
                    <p className="d-flex justify-content-center align-item-center">
                      {item.body}
                    </p>
                    <div className="comment-delete-icon"></div>
                  </div>
                </div>
              ))
            ) : (
              <p>This post has no commnet yet.</p>
            )}
          </div>

          {/* <div className="article-post-comment">
            <Comment />
          </div> */}
        </div>
      </div>
    </>
  );
};
