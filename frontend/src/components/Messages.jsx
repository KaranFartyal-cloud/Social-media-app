import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessages from "../hooks/useGetAllMessages";
import useGetRTM from "../hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessages();
  const bottomRef = useRef(null);
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto ">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={selectedUser.profilePicture}
              className="object-cover"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`profile/${selectedUser._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {messages &&
            messages.map((msg) => {
              return (
                <div
                  className={`flex ${
                    msg.senderId === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.senderId === user?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Messages;
