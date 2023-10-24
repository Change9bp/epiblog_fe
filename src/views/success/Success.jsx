import React, { useState, useEffect } from "react";
import NavBar from "../../components/navbar/BlogNavbar";
import { useParams } from "react-router-dom";

function Success() {
  const { tokenGit } = useParams();

  useEffect(() => {
    localStorage.setItem("tokenGit", tokenGit);
  }, [tokenGit]);

  return (
    <>
      <NavBar />
      <div>
        <p>questa è la pagina giusta</p>
      </div>
    </>
  );
}

export default Success;

//in questa pagina avrei voluto gestire
