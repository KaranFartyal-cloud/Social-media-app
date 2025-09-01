import { Bell, House, LogOut, Mail, Plus, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "../redux/postSlice";

const SideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const sideBarItems = [
    { icon: <House />, title: "Home" },
    { icon: <Search />, title: "Search" },
    { icon: <Send />, title: "Search" },
    { icon: <Plus />, title: "Create" },
    { icon: <Bell />, title: "Notification" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            className="rounded-full object-cover   h-6 w-6"
            src={user?.profilePicture}
          />
          <AvatarFallback>Profile</AvatarFallback>
        </Avatar>
      ),
      title: "Profile",
    },
    { icon: <LogOut />, title: "Log out" },
  ];

  const sideBarHandler = (title) => {
    if (title === "Log out") {
      logOutHandler();
    } else if (title === "Create") {
      setOpen(true);
    } else if (title === "Profile") {
      navigate(`profile/${user._id}`);
    } else if (title == "Home") {
      navigate("/");
    }
  };

  const logOutHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/user/logout");
      if ((data.success = true)) {
        //toast
      }
      toast.success("Logout successful!");
      dispatch(setAuthUser(null));
      dispatch(setPosts([]));
      dispatch(setSelectedPost(null));
      navigate("/login");
    } catch (error) {
      //toast
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="left-0 top-0 px-4 fixed z-10 h-screen border-r border-gray-500 w-[16%]">
        <div className="flex flex-col ">
          <h1 className="mt-8 pl-3 font-bold text-xl">LOGO</h1>

          {sideBarItems.map((item, index) => (
            <div
              onClick={() => sideBarHandler(item.title)}
              className="flex  items-center gap-6 hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-2"
              key={index}
            >
              {item.icon} <span>{item.title}</span>
            </div>
          ))}
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default SideBar;
