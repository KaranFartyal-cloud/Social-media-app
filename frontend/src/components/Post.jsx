import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { setAuthUser } from "../redux/authSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [comments, setComments] = useState(post?.comments);
  const [bookmark, setBookmark] = useState(user?.bookmarks?.includes(post._id));

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://backend-wrbx.onrender.com/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      // console.log(res.data);
      const updatedPostData = posts.filter((item) => item._id !== post._id);
      dispatch(setPosts(updatedPostData));
      toast.success("post has been deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://backend-wrbx.onrender.com/api/v1/post/${post._id}/${action}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const upDatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(upDatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://backend-wrbx.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "Application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // console.log(res.data);
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        setText("");
        dispatch(setPosts(updatedPostData));
        toast.success("Comment added");
      }
    } catch (error) {}
  };

  const bookMarkHandler = async (id) => {
    try {
      const res = await axios.get(
        `https://backend-wrbx.onrender.com/api/v1/post/${id}/bookmark`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.type === "saved") {
          const updatedUserData = {
            ...user,
            bookmarks: [...user.bookmarks, post._id], // immutable add
          };

          dispatch(setAuthUser(updatedUserData));
          setBookmark(true);
        } else {
          const updatedUserData = {
            ...user,
            bookmarks: user.bookmarks.filter((item) => item !== post._id), // immutable remove
          };

          dispatch(setAuthUser(updatedUserData));
          setBookmark(false);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post?.author.profilePicture}
              alt="post-image"
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-2 items-center">
            <h1 className="font-semibold">{post.author.username}</h1>
            {post.author._id === user._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit border-none text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer border-none w-fit"
            >
              Add to favourites
            </Button>
            {user && user._id === post.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit "
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="">
        <div className="flex items-center w-full justify-between my-2">
          <div className="flex items-center gap-3">
            {liked ? (
              <FaHeart
                size={"22px"}
                onClick={likeOrDislikeHandler}
                className="fill-red-600"
              />
            ) : (
              <FaRegHeart size={"22px"} onClick={likeOrDislikeHandler} />
            )}

            <MessageCircle
              onClick={() => {
                setOpen(true);
                dispatch(setSelectedPost(post));
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            {/* <MessageCircle className="cursor-pointer hover:text-gray-600" /> */}
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          {bookmark ? (
            <>
              <Bookmark
                onClick={() => {
                  bookMarkHandler(post._id);
                }}
                className="cursor-pointer fill-black hover:text-gray-600"
              />
            </>
          ) : (
            <>
              <Bookmark
                onClick={() => {
                  bookMarkHandler(post._id);
                }}
                className="cursor-pointer hover:text-gray-600"
              />
            </>
          )}
        </div>
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      {comments.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-400"
          onClick={() => {
            setOpen(true);
            dispatch(setSelectedPost(post));
          }}
        >
          View all {comments.length} comments
        </span>
      )}
      {open && <CommentDialog open={open} setOpen={setOpen} />}

      <div className="flex  items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => changeEventHandler(e)}
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
