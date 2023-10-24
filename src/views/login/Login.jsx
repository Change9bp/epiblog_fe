import React, { useState } from "react";
import { Button, Container, Row, Form } from "react-bootstrap";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  //DEVO TROVARE UN MODO CORRETTO PER RESETTARE I DATI DEL FORM SENZA TROPPI MAGHEGGI

  const [register, setRegister] = useState(false);
  const [dataLogReg, setDataLogReg] = useState({});
  const [avatarImg, setAvatarImg] = useState(null);

  const navigate = useNavigate();

  //setto immagine nello stato
  const handleAvatarImg = (e) => {
    setAvatarImg(e.target.files[0]);
  };

  //gestisco i dati del form e setto lo stato

  const handleFormData = (e) => {
    const { name, value } = e.target;

    setDataLogReg({
      ...dataLogReg,
      [name]: value,
    });

    console.log(dataLogReg);
  };

  //upload dell'immagine su cloudinary, viene lanciata durante la post di registrazione
  const uploadFile = async (avatar) => {
    console.log("bella caro");

    const fileData = new FormData();
    fileData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/authors/cloudupload`,
        fileData
      );
      return response;
    } catch (error) {
      console.log(error, "errore in upload file");
    }
  };

  //post on submit della registrazione author + login
  const registerAuthor = async (e) => {
    e.preventDefault();
    console.log("bella zio", avatarImg);
    let finalBody = { ...dataLogReg };
    if (register) {
      try {
        if (avatarImg) {
          const uploadAvatar = await uploadFile(avatarImg);
          console.log(uploadAvatar);
          finalBody = {
            ...dataLogReg,
            avatar: uploadAvatar.data.avatar,
          };
        }
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_BASE_URL}/authors`,
          finalBody
        );
        return response;
        setRegister(false);
      } catch (error) {
        console.log(error);
      }
    } else if (!register) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_BASE_URL}/login`,
          dataLogReg
        );
        if (response.data.token) {
          console.log("stai salvando il token", response.data.token);
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify(response.data.token)
          );
          navigate("/home"); //vengo reindirizzato alla HOME PAGE
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //LOG WITH GIT
  const redirectForLoginWithGithub = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}/auth/github`;
  };

  return (
    <Container
      id="logReg"
      className="justify-content-center align-items-center mt-5"
    >
      <Row>
        {register === false ? (
          <Form onSubmit={registerAuthor}>
            <Row>
              <Button
                type="reset"
                onClick={() => {
                  setRegister(false);
                  setDataLogReg({});
                  console.log(dataLogReg);
                }}
              >
                Login
              </Button>
              <Button
                type="reset"
                onClick={() => {
                  setRegister(true);
                  setDataLogReg({});
                  console.log(dataLogReg);
                }}
              >
                Signup
              </Button>
            </Row>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                name="email"
                onChange={handleFormData}
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                size="lg"
                name="password"
                onChange={handleFormData}
              />
            </Form.Group>
            <Button type="submit">LogIn</Button>
            <Button onClick={redirectForLoginWithGithub}>
              LogIn whit GitHub
            </Button>
          </Form>
        ) : (
          <Form encType="multipart/form-data" onSubmit={registerAuthor}>
            <Row>
              <Button
                type="reset"
                onClick={() => {
                  setRegister(false);
                  setDataLogReg({});
                  console.log(dataLogReg);
                }}
              >
                Login
              </Button>
              <Button
                type="reset"
                onClick={() => {
                  setRegister(true);
                  setDataLogReg({});
                  console.log(dataLogReg);
                }}
              >
                Signup
              </Button>
            </Row>
            <Form.Group controlId="firstName" className="mt-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                name="name"
                onChange={handleFormData}
              />
            </Form.Group>{" "}
            <Form.Group controlId="LastName" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                name="lastName"
                onChange={handleFormData}
              />
            </Form.Group>{" "}
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                name="email"
                onChange={handleFormData}
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                size="lg"
                name="password"
                onChange={handleFormData}
              />
            </Form.Group>{" "}
            <Form.Group controlId="dateOfBirth" className="mt-3">
              <Form.Label>Date of -birth</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                name="dateOfBirth"
                onChange={handleFormData}
              />
            </Form.Group>{" "}
            <Form.Group controlId="avatar" className="mt-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                size="lg"
                name="avatar"
                onChange={handleAvatarImg}
              />
            </Form.Group>
            <Button type="submit" onClick={() => setRegister(false)}>
              Register
            </Button>
          </Form>
        )}
      </Row>
    </Container>
  );
};

export default Login;
