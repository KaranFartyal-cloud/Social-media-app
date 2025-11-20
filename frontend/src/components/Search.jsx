import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useBackendUrl } from "../context/backendContext";

const Search = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const backendURL = useBackendUrl();

  const handleNavigate = (id) => {
    setOpen(false);
    setQuery("");

    navigate(`/profile/${id}`);
  };

  const handleChange = async (e) => {
    console.log(e.target.value);
    setQuery(e.target.value);
    try {
      const val = e.target.value.trim();
      //   console.log(val);

      const res = await axios.get(`${backendURL}/api/v1/user?search=${val}`, {
        withCredentials: true,
      });

      console.log(res.data);
      setUsers(res.data.users);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent>
          <div className=" flex flex-col">
            <DrawerTitle className="text-2xl my-6 ml-5">Search</DrawerTitle>
            <div className="flex justify-center">
              <Input
                className="focus-visible:ring-0 focus-visible:ring-offset-0 w-[90%]"
                value={query}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ml-6 my-4">
            {users &&
              users.map((user) => {
                return (
                  <div
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg"
                    onClick={() => handleNavigate(user._id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profilePicture}
                        className="object-cover "
                      />
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="font-semibold">{user.username}</span>
                      <span className="text-gray-500">{user.bio}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Search;
