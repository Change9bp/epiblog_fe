import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import axios from "axios";
import "./styles.css";
import NavBar from "../../components/navbar/BlogNavbar";
import { PostProvider } from "../../contexts/reactContext";
import Comments from "../../components/comments/Comments";
import ModifyPost from "../../components/modifyPost/ModifyPost";

const Blog = () => {
  const { modify, setModify } = useContext(PostProvider);
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  useEffect(() => {
    setModify(false);
    getPostId();
  }, []);

  const getPostId = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${id}`,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );

      if (response.data.post) {
        setBlog(response.data.post);
        setLoading(false);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const delPost = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts/${blog._id}`,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <>
        <NavBar />
        <div className="blog-details-root">
          <Container>
            <Image className="blog-details-cover" src={blog.cover} fluid />
            <h1 className="blog-details-title">{blog.title}</h1>

            <div className="blog-details-container">
              <div className="blog-details-author">
                <BlogAuthor {...blog.author} />
              </div>
              <div className="blog-details-info">
                <div>{blog.createdAt}</div>
                <div>{`${blog.readTime.value} ${blog.readTime.unit} read`}</div>
                <div
                  style={{
                    marginTop: 20,
                  }}
                >
                  <BlogLike defaultLikes={["123"]} onChange={console.log} />
                </div>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            ></div>
            <Button onClick={() => setModify(!modify)}>Modify Post</Button>
            <Button onClick={() => delPost()}>Delete Post</Button>
            {modify && <ModifyPost {...blog} />}

            <Comments idPost={id} />
          </Container>
        </div>
      </>
    );
  }
};

export default Blog;
