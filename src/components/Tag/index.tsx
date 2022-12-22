import React, { useEffect, useState } from "react";
import "./tag.css";
import { instance } from "../../httpClient";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
export const Tag = () => {
  const [tags, setTag] = useState([]);
  useEffect(() => {
    axios.get("https://api.realworld.io/api/tags").then((res: any) => {
      setTag(res.data.tags);
    });
  }, []);
  //console.log(tags);
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
                <ListGroup.Item key={index} className="tagList-item">
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
