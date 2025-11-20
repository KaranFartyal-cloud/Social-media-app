import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";
import { useBackendUrl } from "../context/backendContext";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  const backendUrl = useBackendUrl();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/user/suggested`, {
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
