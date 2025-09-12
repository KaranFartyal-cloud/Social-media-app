import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get("https://social-media-app-bbfr.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });
        dispatch(setSuggestedUsers(res.data.users));
        // console.log(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUser();
  }, []);
};

export default useGetSuggestedUsers;
