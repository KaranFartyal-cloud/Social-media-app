import { Bell, House, LogOut, Mail, Plus, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";

const SideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const sideBarItems = [
    { icon: <House />, title: "Home" },
    { icon: <Search />, title: "Search" },
    { icon: <Send />, title: "Messages" },
    { icon: <Plus />, title: "Create" },
    { icon: <Bell />, title: "Notification" },
    {
      icon: (
        <Avatar className="flex items-center">
          <AvatarImage
            className="rounded-full h-6 w-6 object-cover object-center"
            src={user && user.profilePicture}
          />
          <AvatarFallback>Profile</AvatarFallback>
        </Avatar>
      ),
      title: "Profile",
    },
    { icon: <LogOut />, title: "Log out" },
  ];

  const handleClick = (title) => {
    if (title === "Log out") {
      logOutHandler(title);
    }

    if (title === "Create") {
      setOpen(true);
    }

    if (title === "Profile") {
      navigate(`/profile/${user._id}`);
    }

    if (title === "Home") {
      navigate("/");
    }
  };

  const logOutHandler = async (title) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/user/logout");
      if ((data.success = true)) {
        //toast
      }
      toast.success("Logout successful!");
      navigate("/login");
      dispatch(setAuthUser(null));
    } catch (error) {
      //toast
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="left-0 top-0 px-4 fixed z-10 h-screen border-r border-gray-100 w-[16%]">
        <div className="flex justify-center">
          {/* <img src="./writing.png" className="h-25 w-25 " alt="" />
           */}
          <p className="text-2xl font-semibold my-3 mb-3">Halo</p>
        </div>
        <div className="flex flex-col ">
          {sideBarItems.map((item, index) => (
            <div
              onClick={() => handleClick(item.title)}
              className="flex   items-center gap-6 hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-2"
              key={index}
            >
              {item.icon} <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default SideBar;
