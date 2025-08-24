import { Bell, House, LogOut, Mail, Plus, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
          className="rounded-full h-6 w-6"
          src="https://github.com/shadcn.png"
        />
        <AvatarFallback>Profile</AvatarFallback>
      </Avatar>
    ),
    title: "Profile",
  },
  { icon: <LogOut />, title: "Log out" },
];

const SideBar = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logOutHandler = async (title) => {
    if (title !== "Log out") {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/user/logout");
      if ((data.success = true)) {
        //toast
      }
      toast.success("Logout successful!");
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
          {sideBarItems.map((item, index) => (
            <div
              onClick={() => logOutHandler(item.title)}
              className="flex  items-center gap-6 hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-2"
              key={index}
            >
              {item.icon} <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
