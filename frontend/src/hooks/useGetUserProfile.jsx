import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`https://backend-wrbx.onrender.com/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        dispatch(setUserProfile(res.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
