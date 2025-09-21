import React, { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthUser, setUserProfile } from "../redux/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { user, userProfile } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(
    userProfile?.follower.includes(user._id)
  );
  const dispatch = useDispatch();

  // console.log(userProfile);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile?.follower?.includes(user._id));
    }
  }, [userProfile, user]);

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  // console.log(displayedPost);

  const followUnfollowHandler = async () => {
    if (user._id === userProfile._id) {
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/followorunfollow/${userProfile?._id}`,
        { withCredentials: true }
      );

      if (res.data.type === "follow") {
        const updatedUserData = {
          ...user,
          following: [...user?.following, userProfile._id],
        };

        const updatedProfileData = {
          ...userProfile,
          follower: [...userProfile?.follower, user._id],
        };
        dispatch(setUserProfile(updatedProfileData));
        dispatch(setAuthUser(updatedUserData));
        setIsFollowing(true);
        // toast.success("followed");
      } else if (res.data.type === "unfollow") {
        const updatedUserData = {
          ...user,
          following: user?.following?.filter((id) => id !== userProfile?._id),
        };

        const updatedProfileData = {
          ...userProfile,
          follower: userProfile?.follower?.filter((id) => id !== user?._id),
        };
        dispatch(setUserProfile(updatedProfileData));
        dispatch(setAuthUser(updatedUserData));
        setIsFollowing(false);
        // toast.success("unfollowed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex  items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profile photo"
                className="object-cover"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex font-semibold items-center gap-3">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to={"/account/edit"}>
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archieve
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : (
                  <>
                    {isFollowing ? (
                      <>
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                          onClick={followUnfollowHandler}
                        >
                          Unfollow
                        </Button>

                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                        >
                          Message
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="bg-[#0095F6] hover:bg-[#0075c4] h-8"
                          onClick={followUnfollowHandler}
                        >
                          Follow
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  <span>posts</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.follower?.length}
                  </span>{" "}
                  <span>followers</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  <span>following</span>
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="">{userProfile?.bio || "bio here...."}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  {userProfile?.username}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleChangeTab("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-semibold" : ""
              }`}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-semibold" : ""
              }`}
              onClick={() => handleChangeTab("saved")}
            >
              SAVED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="post image"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg bg-opacity-0 opacity-0 group-hover:opacity-50 transition-opacity">
                    <div className="flex items-center text-white space-x-4">
                      <button>
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>

                      <button>
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
