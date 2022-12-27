import React, { useEffect, useState } from "react";
import "./newpost.css";
import { Header } from "../../components/Header";
import { Form, Button } from "react-bootstrap";
import { instance } from "../../httpClient";
import { useNavigate, useParams } from "react-router-dom";
export const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState<any[]>([]);
  const [tags, setTags] = useState("");

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    instance.get(`/articles/${slug}`).then((res: any) => {
      //console.log(res.data);
      if (res.status === 200) {
        setTitle(res.data.article.title);
        setDescription(res.data.article.description);
        setBody(res.data.article.body);
        setTagList(res.data.article.tagList);
      }
    });
  }, [slug]);

  const handleKeyDown = () => {
    setTagList([...tagList, tags]);
    setTags("");
  };

  const handleRemove = (index: number) => {
    const remove = tagList.filter((_, item: any) => item !== index);
    //console.log(remove);
    setTagList(remove);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (slug) {
      instance
        .put(`/articles/${slug}`, {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tagList,
          },
        })
        .then((res: any) => {
          if (res.status === 200) {
            console.log(res.data);
            setTitle("");
            setDescription("");
            setBody("");
            setTags("");
            setTagList([]);
            navigate("/");
          }
        });
    } else {
      instance
        .post("/articles", {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tagList,
          },
        })
        .then((res: any) => {
          if (res.status === 200) {
            console.log(res.data);
            setTitle("");
            setDescription("");
            setBody("");
            setTags("");
            setTagList([]);
            navigate("/");
          }
        });
    }
  };

  return (
    <>
      <div className="NewPost">
        <Header />
        <div className="edit-form">
          <div className="edit-title text-center">
            {!slug ? <h1>New Article</h1> : <h1>Edit Article</h1>}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Article Title:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>About:</Form.Label>
              <Form.Control
                type="text"
                placeholder="What's this article about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Write your article:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Tags:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="d-flex justify-content-between">
                <div className="mt-4">
                  {tagList.map((item: any, index: number) => (
                    <span className="tags" key={index}>
                      <span onClick={() => handleRemove(index)}>x</span> {item}
                    </span>
                  ))}
                </div>
                <Button
                  variant="primary"
                  className="mt-3 "
                  onClick={() => handleKeyDown()}
                >
                  Add Tag
                </Button>
              </div>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="outline-success" type="submit" size="lg">
                Publish Articles
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
