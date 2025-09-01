import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
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

const EditProfile = () => {
  const imgRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const editProfileHandler = async (req, res) => {};

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
          <input ref={imgRef} type="file" className="hidden" />
          <Button
            onClick={() => imgRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#40aff9]"
          >
            Change photo
          </Button>
        </div>

        <div>
          <h1 className="font-bold  mb-2">Bio</h1>
          <Textarea name="bio" className="focus-visible:ring-transparent" />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select>
            <SelectTrigger className="w-[180px]"></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
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
              <Button className="w-ft bg-[#0095F6] hover:bg-[#0075c4]">
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
