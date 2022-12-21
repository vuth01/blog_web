import React, { useEffect, useState } from "react";
import "./comment.css";
import { useSelector } from "react-redux";
import { instance } from "../../httpClient";
import { Link } from "react-router-dom";
import { GrSend } from "react-icons/gr";
export const Comment = ({ slug, listComments, setListComments }: any) => {
  const token = sessionStorage.getItem("userToken");
  const user = useSelector((store: any) => store.user.user);
  const [comment, setComment] = useState([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    instance
      .post(`/articles/${slug}/comments`, {
        comment: {
          body: comment,
        },
      })
      .then((res: any) => {
        setComment([]);
        setListComments([...listComments, res.data.comment]);
      });
  };

  return (
    <div className="Comments py-4 d-flex justify-content-start">
      {token ? (
        <div className="form d-flex">
          <div className="form-user px-2">
            <img
              src={user.image}
              width={"40px"}
              height={"40px"}
              className="rounded-circle"
              alt="avt"
            />
          </div>
          <div className="form-comment">
            <form action="" onSubmit={handleSubmit} className="d-flex">
              <input
                type="text"
                value={comment}
                placeholder="Write your comments..."
                name="comment"
                onChange={(e: any) => setComment(e.target.value)}
              />
              <button className="d-flex align-items-center">
                <div className="px-2">Send</div> <GrSend />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>
          Please <Link to="/login">Sign In</Link> to comment.
        </p>
      )}
    </div>
  );
};
