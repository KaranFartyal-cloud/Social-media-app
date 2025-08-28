import axios from "axios";
import { setPosts } from "../redux/postSlice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = (dependency) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("/api/v1/post/all");
        // console.log(data.posts);
        dispatch(setPosts(data.posts));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPosts();
  }, [dependency]);
};

export default useGetAllPosts;
