import moment from "moment";
import "./articleEdit.css";
import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { BsPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ModalPopUp } from "../../components/ModalPopUp";
import { instance } from "../../httpClient";
import { Comment } from "../../components/Comment";
import { RiChatDeleteLine } from "react-icons/ri";
export const ArticleEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>({});
  const [listComment, setListComment] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [listComments, setListComments] = useState<any>([]);

  useEffect(() => {
    axios
      .get(`https://api.realworld.io/api/articles/${slug}`)
      .then((res: any) => {
        setArticle(res.data.article);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [slug]);

  // useEffect(() => {
  //   axios
  //     .get(`https://api.realworld.io/api/articles/${slug}/comments`)
  //     .then((res: any) => {
  //       setListComment(res.data.comments);
  //     });
  // }, [slug]);

  useEffect(() => {
    instance.get(`/articles/${slug}/comments`).then((res: any) => {
      setListComments([...res.data.comments]);
    });
  }, [slug]);

  const handleEditArticle = () => {
    navigate(`/editor/${slug}`);
  };

  const handleDeleteArticle = () => {
    instance.delete(`/articles/${slug}`).then((res: any) => {
      console.log(res.data);
      if (res.status === 204) {
        navigate("/");
      } else {
        console.log("Error Delete Article");
      }
    });
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
      <div className="article-edit position-relative">
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
              <div className="article-user-name pb-3 ">
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
                onClick={() => handleEditArticle()}
              >
                <BsPencilFill /> Edit Article
              </button>
              <button
                className="article-delete-btn "
                onClick={() => setIsOpen(true)}
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
            {listComments.length > 0 ? (
              listComments.map((item: any, index: number) => (
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
                    <div
                      className="comment-delete-icon px-2"
                      onClick={() => handleDeleteComment(item)}
                    >
                      <RiChatDeleteLine />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>This post has no commnet yet.</p>
            )}
          </div>

          <div className="article-post-comment">
            <Comment
              slug={slug}
              listComments={listComments}
              setListComments={setListComments}
            />
          </div>
        </div>
        <ModalPopUp
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleDeleteArticle={handleDeleteArticle}
          className="modal"
        />
      </div>
    </>
  );
};
