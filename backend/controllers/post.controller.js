import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";
import { Comment } from "../models/comment.model.js";

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

export const likePost = async (req, res) => {
  try {
    const { likeUserId } = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "cant find post",
      });
    }

    //like by the login user logic

    await post.updateOne({ $addToSet: { likes: likeUserId } });
    await post.save();

    //implement socket io for real time notification

    return res.status(200).json({
      message: "post liked",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const { disLikeUserId } = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "cant find post",
      });
    }

    //disLike by the login user logic

    await post.updateOne({ $pull: { likes: disLikeUserId } });
    await post.save();

    //implement socket io for real time notification

    return res.status(200).json({
      message: "post disliked",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params.id;
    const userId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "can't find post",
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "text is required",
      });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    }).populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);

    await post.save();

    return res.status(201).json({
      message: "comment added",
      comment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getPostComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username , profilePicture",
    });

    if (!comments) {
      return res.status(404).json({
        message: "No comments",
        success: false,
      });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "user is not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId); //we have to delte user's post too (see in model)

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);

    await user.save();

    //delete all the comments in that post

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
      //that means we have to remove from bookmarked post

      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        type: "unsaved",
        message: "post removed from bookmark",
        success: true,
      });
    } else {
      //that means we have to bookmark this post for this user

      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        type: "saved",
        message: "post is bookmarked",
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
