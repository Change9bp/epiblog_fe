import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import axios from "axios";
import NavBar from "../navbar/BlogNavbar";
import { PostProvider } from "../../contexts/reactContext";

const ModifyPost = (blog) => {
  const { _id } = blog;
  const [initialValue, setInitialValue] = useState({});
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [file, setFile] = useState(null);
  const { setModify } = useContext(PostProvider);

  function handleOnChangeFile(e) {
    setFile(e.target.files[0]);
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setInitialValue({
      ...initialValue,
      [name]: value,
    });

    console.log("contenuto del form", initialValue);
  }

  const handleReadTime = (e) => {
    const { name, value } = e.target;

    setInitialValue({
      ...initialValue,
      readTime: {
        ...initialValue.readTime,
        [name]: name === "value" ? parseInt(value) : value,
      },
    });
  };

  useEffect(() => {
    console.log("initialValue", initialValue);
    let html = convertToHTML(editorState.getCurrentContent());
    setInitialValue({
      ...initialValue,
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

  const postPatch = async (e) => {
    e.preventDefault();
    console.log("bella zio");

    try {
      let finalBody = {
        ...initialValue,
      };
      if (file) {
        const uploadCover = await uploadFile(file);
        console.log(uploadCover);
        finalBody = {
          ...initialValue,
          cover: uploadCover.data.cover,
        };
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${_id}`,
        finalBody,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );
      return response;
      setModify(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="new-blog-container">
        <Form
          encType="multipart/form-data"
          onSubmit={postPatch}
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

export default ModifyPost;
