import React from "react";
import NavBar from "../../components/navbar/BlogNavbar";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = (props) => {
  return (
    <>
      <NavBar />
      <Container fluid="sm">
        <h1 className="blog-main-title">Welcome to the Epicode Blog!</h1>
        <BlogList />
      </Container>
    </>
  );
};

export default Home;
