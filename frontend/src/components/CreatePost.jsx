import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImagePlay } from "lucide-react";
import axios from "axios";
import { VisuallyHidden } from "radix-ui";
import useGetAllPosts from "../hooks/useGetAllPost";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const [refresh, setRefresh] = useState(false);
  const fileInputRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const { posts, setPosts } = useSelector((store) => store.post);
  // const getAllPosts = useGetAllPosts();
  useGetAllPosts(refresh);

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", photo);
      formData.append("caption", caption);

      const { data } = await axios.post("/api/v1/post/addPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // important for sending cookies (auth)
      });
      // console.log(data);
      setRefresh(!refresh);

      setOpen(false);
    } catch (error) {
      toast.error("couldn't create the post");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <VisuallyHidden.Root>
        <DialogTitle>create post</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false);
          setPreview(null);
        }}
        className="p-5 w-[30%] h-[500px] fixed"
      >
        <div className="flex flex-col  justify-between items-center">
          <span className="font-semibold">Create new post</span>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleChange(e)}
          />

          {preview ? (
            <div className="flex flex-col items-center">
              <form onSubmit={(e) => handleSubmit(e)}>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48  object-cover rounded-lg shadow m-5"
                />
                <div className="flex justify-center items-center gap-3">
                  <input
                    type="text"
                    placeholder="type the caption"
                    className="focus:outline-none border-b-2"
                    onChange={(e) => setCaption(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="p-1 bg-[#4150F7] text-white rounded-lg mb-5"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <ImagePlay className="h-48 w-48" strokeWidth={0.75} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-end">
          <button
            onClick={handleClick}
            className="p-2 bg-[#4150F7] text-white rounded-lg mb-5"
          >
            <span>Select from computer</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
