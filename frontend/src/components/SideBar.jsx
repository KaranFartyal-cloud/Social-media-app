import { Bell, House, LogOut, Mail, Plus, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchComp from "./Search";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { setNotification } from "../redux/rtnslice";

const SideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const dispatch = useDispatch();
  const { notification } = useSelector((store) => store.realTimeNotification);

  const sideBarItems = [
    { icon: <House />, title: "Home" },
    { icon: <Search />, title: "Search" },
    { icon: <Send />, title: "Message" },
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
    } else if (title == "Message") {
      navigate("/chat");
    } else if (title == "Search") {
      setOpenSearch(true);
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
      dispatch(setNotification([]));
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
          {/* <h1 className="mt-8 pl-3 font-bold text-xl">LOGO</h1>
           */}
          <img
            src="https://res.cloudinary.com/dsixpdfy7/image/upload/v1757101035/qzhrrira7nfu8thtlrfd.png"
            className="h-30 w-30"
            alt="logo"
          />

          {sideBarItems.map((item, index) => (
            <div
              onClick={() => sideBarHandler(item.title)}
              className="flex  items-center gap-6 hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-2"
              key={index}
            >
              {item.icon} <span>{item.title}</span>
              {item.title === "Notification" && notification.length > 0 && (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5  bottom-6 left-6 bg-red-500"
                      >
                        {notification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {notification.length === 0 ? (
                          <div>No new Notifications</div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {notification.map((notifi) => {
                              return (
                                <div
                                  className="flex items-center gap-2"
                                  key={notifi.userId}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      className="object-cover"
                                      src={notifi.userDetails?.profilePicture}
                                    />
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notifi.userDetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>
          ))}
        </div>
        <SearchComp open={openSearch} setOpen={setOpenSearch} />
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default SideBar;
