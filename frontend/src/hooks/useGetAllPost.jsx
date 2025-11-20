import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { useBackendUrl } from "../context/backendContext";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const backendUrl = useBackendUrl();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/post/all`, {
          withCredentials: true,
        });
        dispatch(setPosts(res.data.posts));
        // console.log(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};

export default useGetAllPost;
