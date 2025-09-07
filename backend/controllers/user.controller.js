import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "please provide all the fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already registered",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      user,
      success: true,
      message: "account created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "please provide all the fields",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "incorrect email or password",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);

        if (post.author.equals(user._id)) {
          return post;
        }
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.follower,
      following: user.following,
      posts: populatedPost,
      bookmarks: user.bookmarks,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `${user.username} is logged in`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    await user.populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });

    await user.populate({
      path: "bookmarks",
    });

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const allUsers = async (req, res) => {
  try {
    if (!req.query.search) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            // { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword)
      .find({ _id: { $ne: req.id } })
      .select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file; //comes from multer req.file
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture); //getDatauri() gives a data uri string (long mumble jumble base 64 coded file which cloudinary.uploader expects)
      // console.log(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri); //uploads to cloudinary and returns a response
      // console.log(cloudResponse);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Not found user",
      });
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }

    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "profile updated",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSuggestUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers) {
      res.status(400).json({
        message: "currently do not have any users",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followerId = req.id;
    const userToFollow = req.params.id;

    if (followerId === userToFollow) {
      return res.status(400).json({
        message: "cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followerId);
    const targetedUser = await User.findById(userToFollow);

    if (!user || !targetedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(targetedUser._id.toString());

    if (isFollowing) {
      //that means we have to write unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $pull: { following: targetedUser._id } }
        ),

        User.updateOne(
          { _id: targetedUser._id },
          { $pull: { follower: followerId } }
        ),
      ]);

      return res.status(200).json({
        type: "unfollow",
        message: "unfollowed successfully",
        success: true,
      });
    } else {
      //now follow logic needs to be done

      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $push: { following: targetedUser._id } }
        ),

        User.updateOne(
          { _id: targetedUser._id },
          { $push: { follower: followerId } }
        ),
      ]);

      return res.status(200).json({
        type: "follow",
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
