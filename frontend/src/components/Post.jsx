import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogComment from "./DialogComment";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useNavigate } from "react-router-dom";

const Post = ({
  username,
  avatar,
  postImage,
  caption,
  likes,
  comments,
  id,
  authorId,
}) => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleCommentConfig = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setComment(inputText);
    } else {
      setComment("");
    }
  };

  const goToProfile = () => {
    navigate(`/profile/${authorId}`);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-4">
          <img
            src={avatar}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold" onClick={goToProfile}>
            {username}
          </span>
        </div>

        {/* Post Image */}
        <img
          src={postImage}
          alt="Post"
          className="w-full aspect-square object-cover"
        />

        {/* Post Actions */}
        <div className="p-4 ">
          <div className="mb-3 flex  items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart />
              <Dialog>
                <VisuallyHidden>
                  <DialogTitle>Comments</DialogTitle>
                </VisuallyHidden>
                <DialogTrigger>
                  <MessageCircle />
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-0 flex flex-col">
                  <DialogComment
                    id={id}
                    avatar={avatar}
                    name={username}
                    caption={caption}
                    comments={comments}
                    postImage={postImage}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Bookmark className="justify-self-end" />
          </div>
          <p className="font-semibold">
            {} likes {likes}{" "}
          </p>

          <div>
            <span className="font-semibold">{username}</span>{" "}
            <span>{caption}</span>
            <span className="text-sm opacity-55 mt-2 block cursor-pointer">
              view all {comments.length === 0 || 1 ? <></> : <>{comments}</>}{" "}
              comments
            </span>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="add your comment"
                className="focus:outline-none text-[12px] mt-3 w-full"
                onChange={(e) => handleCommentConfig(e)}
              />
              {comment && (
                <span className="text-[#3BADF8] cursor-pointer">Post</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
