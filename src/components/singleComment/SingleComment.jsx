import React, { useState } from "react";
import { Card, Image, Button, Form } from "react-bootstrap";
import axios from "axios";

const SingleComment = ({ comment, idPost }) => {
  const { commentText, rate, author, _id } = comment;
  const [inEditing, setInEditing] = useState(false);
  const [commEdit, setCommEdit] = useState({ commentText, rate: Number(rate) });

  function handleOnChange(e) {
    const { name, value } = e.target;

    setCommEdit({
      ...commEdit,
      [name]: name === "rate" ? parseInt(value) : value,
    });
    console.log(commEdit);
  }

  async function patchDelComment(methodFetch) {
    try {
      if (
        methodFetch === "delete"
          ? window.confirm("Sei sicuro di voler cancellare il commento?")
          : !!methodFetch
      ) {
        if (methodFetch === "patch") {
          const response = await axios[methodFetch](
            `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${idPost.idPost}/comments/${_id}`,
            commEdit,
            {
              headers: {
                Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
              },
            }
          );
          setInEditing(!inEditing);
        } else {
          const response = await axios[methodFetch](
            `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${idPost.idPost}/comments/${_id}`,
            {
              headers: {
                Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
              },
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="mb-4">
      {!inEditing ? (
        <Card.Body>
          <p>{commentText}</p>

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <Image src={author.avatar} alt="avatar" width="25" height="25" />
              <p className="small mb-0 ms-2">
                {author.name} {author.lastName}
              </p>
            </div>
            <div className="d-flex flex-row align-items-center">
              <p className="small text-muted mb-0">rate</p>

              <p className="small text-muted mb-0">{rate}</p>
            </div>
          </div>
        </Card.Body>
      ) : (
        <Card.Body>
          <Form.Control
            value={commEdit.commentText}
            type="text"
            name="commentText"
            onChange={handleOnChange}
          />

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <Image src={author.avatar} alt="avatar" width="25" height="25" />
              <p className="small mb-0 ms-2">
                {author.name} {author.lastName}
              </p>
            </div>
            <div className="d-flex flex-row align-items-center">
              <p className="small text-muted mb-0">rate </p>

              <Form.Control
                value={commEdit.rate}
                type="number"
                size="lg"
                max={5}
                name="rate"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </Card.Body>
      )}
      {inEditing ? (
        <>
          <Button onClick={() => patchDelComment("patch")} size="sm">
            Save
          </Button>
          <Button onClick={() => setInEditing(!inEditing)} size="sm">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => setInEditing(!inEditing)} size="sm">
            Edit
          </Button>

          <Button onClick={() => patchDelComment("delete")} size="sm">
            Delete
          </Button>
        </>
      )}
    </Card>
  );
};

export default SingleComment;
