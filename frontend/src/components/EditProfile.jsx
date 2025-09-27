import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { setAuthUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const imgRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio);
  const [file, setFile] = useState(null);
  const [gender, setGender] = useState(user?.gender || "male");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectChangeHandler = (e) => {
    const selFile = e.target.files[0];
    setFile(selFile);
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);
    if (file) formData.append("profilePicture", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/v1/user/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        withCredentials: true,
      });
      setLoading(false);

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        };

        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user._id}`);

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("couldn't update profile");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl pl-10  mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                className="object-cover"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">{user.bio}</span>
            </div>
          </div>
          <input
            ref={imgRef}
            type="file"
            className="hidden"
            onChange={(e) => selectChangeHandler(e)}
          />
          <Button
            onClick={() => imgRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#40aff9]"
          >
            Change photo
          </Button>
        </div>

        <div>
          <h1 className="font-bold  mb-2">Bio</h1>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select value={gender} onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end">
          {loading ? (
            <>
              <Button className="w-ft bg-[#0095F6] hover:bg-[#0075c4]" disabled>
                <Loader2Icon className="animate-spin" />
                Please wait
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => editProfileHandler()}
                className="w-ft bg-[#0095F6] hover:bg-[#0075c4]"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
