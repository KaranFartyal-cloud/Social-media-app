import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";
import { useBackendUrl } from "../context/backendContext";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const backendUrl = useBackendUrl();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        dispatch(setUserProfile(res.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
