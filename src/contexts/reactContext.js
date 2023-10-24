import React, { createContext, useState } from "react";
import axios from "axios";

export const PostProvider = createContext();

const PostContext = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [dataBlog, setDataBlog] = useState({});
  const [dataUser, setDataUser] = useState(
    JSON.parse(localStorage.getItem("userDataDetails"))
  );
  const [modify, setModify] = useState(false);

  // chiamata GET dei post per popolare home
  const getBlogPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogposts?page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("loggedInUser")),
          },
        }
      );
      setDataBlog(await response.data);
      console.log("datablog", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PostProvider.Provider
      value={{
        dataBlog,
        currentPage,
        setCurrentPage,
        dataUser,
        modify,
        setModify,
        getBlogPosts,
      }}
    >
      {children}
    </PostProvider.Provider>
  );
};

export default PostContext;
