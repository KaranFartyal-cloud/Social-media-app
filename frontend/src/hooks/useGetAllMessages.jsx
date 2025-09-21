import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/message/all/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(res.data.message));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessages;
