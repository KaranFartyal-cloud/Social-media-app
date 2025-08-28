import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { useSelector } from "react-redux";
import useGetAllPosts from "../hooks/useGetAllPost";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const [refresh, setRefresh] = useState(false);
  useGetAllPosts(refresh);

  // useEffect(() => {
  //   async function getPost() {
  //     const { data } = await axios.get("/api/v1/post/all");
  //     // console.log(data);

  //     // console.log(data.posts);
  //     setPosts(data.posts);
  //   }

  //   getPost();
  // }, []);

  return (
    <div>
      {posts.map((item, index) => (
        <Post
          key={index}
          postImage={item.image}
          username={item.author.username}
          avatar={item.author.profilePicture}
          caption={item.caption}
          id={item._id}
          likes={item.likes.length}
          comments={item.comments}
          authorId={item.author._id}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ))}
    </div>
  );
};

export default Posts;
