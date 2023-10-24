import React, { useState } from "react";
import NavBar from "../../components/navbar/BlogNavbar";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";
import "./settingAuthorImg.css";

//questa chiamata da errore 500 ma sembra fare correttamente l'upload dell'immagine sul db CONTROLLARE SE CE TEMPO

const SettingAuthorImg = () => {
  const [avatarImg, setAvatarImg] = useState(null);

  const dataUser = JSON.parse(localStorage.getItem("userDataDetails"));

  const handleAvatarImg = (e) => {
    setAvatarImg(e.target.files[0]);
    console.log("da dove arriva id user token ", dataUser);
  };

  // invio a cloudinary

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

  // invio il form

  const changeAuthorImg = async (e) => {
    e.preventDefault();
    console.log("bella zio", avatarImg);

    if (avatarImg) {
      try {
        const uploadAvatar = await uploadFile(avatarImg);
        console.log(uploadAvatar);
        const finalBody = {
          avatar: uploadAvatar.data.avatar,
        };
        console.log(
          "final body",
          finalBody,
          "uploadAvatar.avatar",
          uploadAvatar.data.avatar
        );
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVER_BASE_URL}/authors/${dataUser.id}`,
          finalBody,
          {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Form
          id="settingAuthorImg"
          encType="multipart/form-data"
          onSubmit={changeAuthorImg}
        >
          <Form.Group controlId="avatar-image" className="mt-5">
            <Form.Label>Change author avatar</Form.Label>
            <Form.Control
              type="file"
              size="lg"
              name="avatar"
              onChange={handleAvatarImg}
            />
          </Form.Group>
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
      </Container>
    </>
  );
};

export default SettingAuthorImg;
