import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice.js";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);
  useEffect(() => {
    const fetchRTM = async () => {
      socket?.on("newMessage", (newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
      });
    };

    fetchRTM();
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};

export default useGetRTM;
