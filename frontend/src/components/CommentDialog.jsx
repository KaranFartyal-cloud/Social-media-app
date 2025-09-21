import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { toast } from "react-toastify";

const CommentDialog = ({ open, setOpen }) => {
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [comment, setComment] = useState(selectedPost?.comments || null);

  // useEffect(() => {
  //   console.log(comment);
  // });

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://backend-wrbx.onrender.com/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "Application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false);
          dispatch(setSelectedPost(null));
        }}
        className="p-0 h-[500px] w-full !max-w-5xl flex flex-col "
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-contain bg-black rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center ">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author.profilePicture}
                      alt="post-image"
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">bio here....</span>s */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer " />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {/* {comment.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })} */}

              {comment.map((item) => {
                return <Comment key={item._id} comment={item} />;
              })}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none  rounded"
                  onChange={changeEventHandler}
                  value={text}
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                  className="h-[30px]"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
