import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSelectedUser } from "../redux/authSlice";
import { Button } from "@/components/ui/button";
import { MessageCircle, MessageCircleCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import Messages from "./Messages";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );

  const { onlineUsers } = useSelector((store) => store.chat);

  const dispatch = useDispatch();

  return (
    <div className="flex ml-[16%] h-screen ">
      <section className="w-full md:w-1/4 my-8">
        {" "}
        <h1 className="font-bold mb-4 px-3 text-xl">{user.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    className=" object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-400" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <>
          <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full ">
            <div className="flex gap-3 px-3 py-2 items-center border-b-gray-300 sticky top-0 bg-white z-10 ">
              <Avatar>
                <AvatarImage
                  src={selectedUser.profilePicture}
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col ">
              <span>{selectedUser?.username}</span>
            </div>
            <Messages selectedUser={selectedUser} />
            <div className="flex items-center p-4 border-t border-t-gray-300">
              <Input
                className="flex-1 mr-2 focus-visible:ring-transparent"
                placeholder="messages..."
                type="text"
              />
              <Button>Send</Button>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mx-auto">
            <MessageCircleCode className="w-32 h-32 my-4 " />
            <h1 className="font-bold">Your messages</h1>
            <span>Send a message to start a chat</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
