import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/mainLayout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnineUsers } from "./redux/chatSlice";
import { setNotification } from "./redux/rtnslice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, //this guy will remain constant in its children
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      //listening the events

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
