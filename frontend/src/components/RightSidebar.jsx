import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-28">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} className="object-cover " />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">{user?.bio}</span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
