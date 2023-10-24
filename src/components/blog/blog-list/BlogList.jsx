import React, { useContext, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { PostProvider } from "../../../contexts/reactContext";

const BlogList = () => {
  const { getBlogPosts, dataBlog, currentPage, setCurrentPage } =
    useContext(PostProvider);

  const handlePagination = (value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    getBlogPosts();
  }, [currentPage]);

  return (
    <Row>
      {dataBlog.posts?.map((post) => (
        <Col
          key={post._id}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          {<BlogItem key={post._id} {...post} />}
        </Col>
      ))}
      <ResponsivePagination
        current={currentPage}
        total={dataBlog && dataBlog.totalPages}
        onPageChange={handlePagination}
      />
    </Row>
  );
};

export default BlogList;
