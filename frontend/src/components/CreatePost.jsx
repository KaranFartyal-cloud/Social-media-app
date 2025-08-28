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

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const fileInputRef = useRef(null);
  const [caption, setCaption] = useState("");

  const [preview, setPreview] = useState(null);

  const createPostHandler = async (e) => {
    e.preventDefault();

    try {
    } catch (error) {}
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.warning("please provide a photo");
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    } catch (error) {}
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
