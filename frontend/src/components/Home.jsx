import React from "react";
import Posts from "./Posts";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center">
      <div className="flex-grow ">
        <Feed />
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
