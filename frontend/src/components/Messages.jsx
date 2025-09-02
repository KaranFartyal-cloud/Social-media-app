import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Messages = ({ selectedUser }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser.profilePicture} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`profile/${selectedUser._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>

        <div>{/* messages */}</div>
      </div>
    </div>
  );
};

export default Messages;
