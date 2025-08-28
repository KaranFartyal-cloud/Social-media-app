import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Ellipsis, Heart, MessageCircle } from "lucide-react";
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
import { useSelector } from "react-redux";
import axios from "axios";
import useGetAllPosts from "../hooks/useGetAllPost";

const Post = ({
  username,
  avatar,
  postImage,
  caption,
  likes,
  comments,
  id,
  authorId,
  refresh,
  setRefresh,
}) => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

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

  const deleteHandler = async () => {
    console.log("delete has been called");

    try {
      const { data } = await axios.get(`/api/v1/post/delete/${id}`);
      console.log("deleted");
      setOpen(false);
      setRefresh(!refresh);
    } catch (error) {}
  };

  const unfollowHandler = () => {
    console.log("unfollow ");
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-[400px] bg-white rounded-xl ">
        {/* Post Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 p-4">
            <img
              src={avatar}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span
              className="font-semibold cursor-pointer"
              onClick={goToProfile}
            >
              {username}
            </span>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Ellipsis className="mr-5 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="h-[300px] w-[30%] rounded-4xl">
              <div className="flex flex-col  items-center">
                <button className="my-3">
                  {user._id === authorId ? (
                    <span
                      className="text-[#ED4956] font-medium "
                      onClick={deleteHandler}
                    >
                      Delete
                    </span>
                  ) : (
                    <span
                      className="text-[#ED4956] font-medium "
                      onClick={unfollowHandler}
                    >
                      Unfollow
                    </span>
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
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
