import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { readFileAsDataURL } from "../lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/post/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("New post created");
        dispatch(setPosts([res.data.post, ...posts]));
      }
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false);
          setFile("");
          setImagePreview("");
          setCaption("");
        }}
      >
        <DialogHeader className="text-center font-bold">
          Create a new post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt=""
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="font-semibold text-s">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write the caption...."
        />

        {imagePreview && (
          <div className="w-full h-400px flex items-center justify-center ">
            <img
              src={imagePreview}
              alt="preview image"
              className="object-cover aspect-square h-[300px] w-[300px] rounded-lg"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className=" w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <>
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                please wait
              </Button>
            </>
          ) : (
            <>
              <Button onClick={createPostHandler} className="w-full">
                post
              </Button>
            </>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
