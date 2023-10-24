import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import axios from "axios";
import NavBar from "../../components/navbar/BlogNavbar";
import { PostProvider } from "../../contexts/reactContext";
import { useNavigate } from "react-router-dom";

const NewBlogPost = (props) => {
  const [formData, setFormData] = useState({});
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [file, setFile] = useState(null);
  const { dataUser } = useContext(PostProvider);

  const navigate = useNavigate();

  function handleOnChangeFile(e) {
    setFile(e.target.files[0]);
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    console.log("contenuto del form", formData);
    console.log("contenuto del datauser", dataUser);
  }

  //PENSAVO AVREBBE FUNZIONATO ED INVECE NO
  const handleReadTime = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      readTime: {
        ...formData.readTime,
        [name]: name === "value" ? parseInt(value) : value,
      },
    });
  };

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setFormData({
      ...formData,
      content: html,
    });
  }, [editorState]);

  //FUNZONE DI UPLOAD DI SOLO FILE
  const uploadFile = async (cover) => {
    console.log("bella caro");

    const fileData = new FormData();
    fileData.append("cover", cover);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/cloudupload`, //se volessi farlo con cloudinary l'url finirebbe con "cloudUpload" come la rotta indicata nel back-end
        fileData
      );
      return response;
    } catch (error) {
      console.log(error, "errore in upload file");
    }
  };

  const postPost = async (e) => {
    e.preventDefault();
    console.log("bella zio");

    if (file) {
      try {
        const uploadCover = await uploadFile(file);
        console.log(uploadCover);
        const finalBody = {
          ...formData,
          cover: uploadCover.data.cover,
          author: dataUser.id,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts`,
          finalBody,
          {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
            },
          }
        );
        navigate("/home");
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <NavBar />
      <Container className="new-blog-container">
        <Form
          encType="multipart/form-data"
          onSubmit={postPost}
          className="mt-5"
        >
          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              size="lg"
              placeholder="Title"
              name="title"
              onChange={handleOnChange}
            />
          </Form.Group>
          <Form.Group controlId="blog-image" className="mt-3">
            <Form.Label>Cover</Form.Label>
            <Form.Control
              type="file"
              size="lg"
              name="cover"
              onChange={handleOnChangeFile}
            />
          </Form.Group>
          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              size="lg"
              as="select"
              name="category"
              onChange={handleOnChange}
            >
              <option>Category1</option>
              <option>Category2</option>
              <option>Category3</option>
              <option>Category4</option>
              <option>Category5</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="blog-content" className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={setEditorState}
            />
          </Form.Group>
          <Form.Group controlId="read-time" className="mt-3">
            <Form.Label>Read Time value</Form.Label>
            <Form.Control
              type="number"
              size="lg"
              placeholder="set a number"
              name="value"
              onChange={handleReadTime}
            />
            <Form.Label>Read Time unit</Form.Label>
            <Form.Control
              size="lg"
              as="select"
              placeholder="unit"
              name="unit"
              onChange={handleReadTime}
            >
              <option> </option>
              <option>Minutes</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
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
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

export default NewBlogPost;
