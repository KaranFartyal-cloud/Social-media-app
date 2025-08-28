import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import DialogFollowing from "./DialogFollowing";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  // console.log(userId);
  useGetUserProfile(userId);
  const [open, setOpen] = useState(false);

  const { userProfile, user } = useSelector((store) => store.auth);

  if (!userProfile) {
    return (
      <div className="ml-[16%] w-[84%] flex justify-center">Loading...</div>
    );
  }

  const posts = userProfile.posts || [];
  // console.log(user);
  // console.log(userProfile);
  // console.log(userProfile.posts);

  const followUser = () => {
    console.log("let's follow", user, userProfile); //start from here
  };

  return (
    <div className="ml-[16%] w-[84%] flex justify-center">
      <div className="max-w-4xl w-full px-6">
        {/* --- Profile Header --- */}
        <div className="flex items-center gap-12 py-10">
          {/* Profile Pic */}
          <div className="w-32 h-32">
            <img
              src={userProfile.profilePicture}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-6 mb-4 w-[50%]">
              <h2 className="text-2xl font-medium">{userProfile.username}</h2>
              <button
                onClick={followUser}
                className="bg-[#4A5DF9] text-white h-[30px] w-[100px] rounded-lg"
              >
                Follow
              </button>
              <button className="px-3 py-1 text-sm font-semibold border rounded-md">
                Edit Profile
              </button>

              <DialogFollowing
                open={open}
                setOpen={setOpen}
                following={userProfile.following}
              />
            </div>
            {/* Stats */}
            <div className="flex gap-8 mb-4">
              <p>
                <span className="font-semibold">
                  {userProfile.posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile.follower.length}
                </span>{" "}
                followers
              </p>
              <p className="cursor-pointer" onClick={() => setOpen(true)}>
                <span className="font-semibold">
                  {userProfile.following.length}
                </span>{" "}
                following
              </p>
            </div>
            {/* Bio */}
            <div>
              <p className="font-semibold">{userProfile.username}</p>
              <p className="text-sm">{userProfile.bio}</p>
            </div>
          </div>
        </div>
        <hr />
        {/* --- Posts Grid --- */}
        <div className="grid grid-cols-3 gap-1 mt-6">
          {posts.map((post, index) => (
            <div key={index} className="aspect-square">
              <img
                src={post.image}
                alt={`post-${index}`}
                className="w-full h-full object-cover "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
