import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import SingleComment from "../singleComment/SingleComment";
import { PostProvider } from "../../contexts/reactContext";

const Comments = (idPost) => {
  const [postComments, setPostComments] = useState([]);
  const [formData, setFormData] = useState({});
  const { dataUser } = useContext(PostProvider);

  function handleOnChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "rate" ? parseInt(value) : value,
      postId: idPost.idPost,
      author: dataUser.id,
    });
    console.log(formData);
  }

  const postComment = async (e) => {
    e.preventDefault();
    console.log("bella zio");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${idPost.idPost}`,
        formData,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );
      getComments();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${idPost.idPost}/comments`,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );
      setPostComments(await response.data.findComments);
      console.log("Comment blog", response.data.findComments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
    console.log("questo è id che passo a author", dataUser.id);
  }, []);

  return (
    <Container className="mt-5" style={{ maxWidth: "1000px" }}>
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card
            className="shadow-0 border"
            style={{ backgroundColor: "#f0f2f5" }}
          >
            <Card.Body>
              <Form onSubmit={postComment}>
                <Form.Control
                  type="text"
                  wrapperClass="mb-4"
                  placeholder="Type comment..."
                  label="+ Add a note"
                  name="commentText"
                  onChange={handleOnChange}
                />
                <Form.Control
                  type="number"
                  size="lg"
                  max={5}
                  name="rate"
                  onChange={handleOnChange}
                />
                <Button
                  type="submit"
                  size="lg"
                  variant="dark"
                  style={{
                    marginLeft: "1em",
                  }}
                >
                  Submit
                </Button>
              </Form>
              {postComments?.map((comment) => (
                <SingleComment
                  key={comment._id}
                  comment={comment}
                  idPost={idPost}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Comments;
