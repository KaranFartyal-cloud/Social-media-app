import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPost() {
      const { data } = await axios.get("/api/v1/post/all");

      // console.log(data.posts);
      setPosts(data.posts);
    }

    getPost();
  }, []);

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
        />
      ))}
    </div>
  );
};

export default Posts;
