import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";

export const addNewPost = async (req, res) => {
  try {
    const caption = req.body.caption?.trim();

    const image = req.file;

    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "image is required",
      });
    }

    //image upload

    if (!["image/jpeg", "image/png", "image/jpg"].includes(image.mimetype)) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    const optimisedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // console.log(optimisedImageBuffer);

    const fileUri = `data:image/jpeg;base64,${optimisedImageBuffer.toString(
      "base64"
    )}`; //buffer to data uri

    // console.log(fileUri);

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "cant find user",
      });
    }

    user.posts.push(post._id);
    await user.save();

    await post.populate("author", "-password");

    return res.status(201).json({
      message: "new post added",
      post,
      success: true,
    });

    // const user = User.findById(authorId)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username email profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, //doesn't require options if using find method , requires it if using populate
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" }, // optional
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
