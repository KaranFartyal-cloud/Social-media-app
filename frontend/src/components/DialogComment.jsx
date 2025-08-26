import React, { useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import Comment from "./Comment";
import { Heart, MessageCircle } from "lucide-react";

const DialogComment = ({ id, avatar, name, caption, comments, postImage }) => {
  useEffect(() => {
    console.log(comments);
  }, []);

  return (
    <div className="flex w-full max-w-5xl h-[600px]">
      {/* Left Side: Post Image */}
      <div className="w-1/2">
        <img
          src={postImage}
          alt=""
          className="w-full h-full object-contain bg-black"
        />
      </div>
      {/* Right Side: Comments */}
      <div className="flex w-1/2 flex-col">
        {/* Post Header */}
        <div className="flex items-center gap-3 my-3 ml-4">
          <img
            src={avatar}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-bold text-gray-900 text-base">{name}</span>
        </div>

        <div className="border border-gray-100"></div>

        {/* Caption */}
        <div className="flex items-center gap-3 my-3 ml-4">
          <img
            src={avatar}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-bold text-gray-900 text-base">{name}</span>
          <span className="text-sm text-gray-800">{caption}</span>
        </div>

        {/* Comments List (Scrollable) */}
        <div className="ml-4 mt-3 flex-1 overflow-y-scroll scrollbar-hide pr-3">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              picture={comment.author.profilePicture}
              username={comment.author.username}
              id={comment._id}
              text={comment.text}
            />
          ))}
        </div>

        {/* <div>
          <div>
            <Heart />
            <MessageCircle/>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DialogComment;
