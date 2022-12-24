import React, { useEffect, useState } from "react";
import "./tag.css";
import { instance } from "../../httpClient";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
export const Tag = ({ getTag, setData }: any) => {
  const [tags, setTag] = useState([]);
  useEffect(() => {
    axios.get("https://api.realworld.io/api/tags").then((res: any) => {
      setTag(res.data.tags);
    });
  }, []);
  //console.log(tags);
  const handleTag = (item: any) => {
    getTag(item);
    axios
      .get("https://api.realworld.io/api/articles", {
        params: {
          tag: item,
        },
      })
      .then((res: any) => {
        console.log(res.data);
        setData(res.data.articles);
      });
  };
  return (
    <>
      <div className="Tag">
        <div className="tag-title">
          <p className="pb-2">
            <b>Popular Tag:</b>
          </p>
          <div>
            <ListGroup numbered>
              {tags.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="tagList-item"
                  onClick={() => handleTag(item)}
                >
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
};
