import { StatusCodes } from "http-status-codes";
import { enumStatus } from "~/enums/enum";
import userModel from "~/models/userModel";
import { postService } from "~/services/postService";
import ApiError from "~/utils/ApiError";

const addPost = async (req, res, next) => {
  try {
    const { userId, title, content, images } = req.body;

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found user!");
    }

    await postService.createPost({ data: req.body, userId: userId });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Post success!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const postComment = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.content) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post require content!");
    }

    const user = await userModel.findOne({ _id: data.userId });
    const post = await postService.getPost(req.params.id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found user!");
    }
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }

    await postService.createComment({ data: data, post: req.params.id });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Post comment success!"
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const post = await postService.getPost(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }
    const deleteCommentResult = await postService.deleteComment({
      post: post,
      userId: userId,
      commentId: commentId
    });
    if (deleteCommentResult == null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Delete fail");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Delete comment ${commentId} success!`,
      deleteData: deleteCommentResult
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const addReaction = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    const post = await postService.getPost(req.params.id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found user!");
    }
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }

    const reaction = await postService.reaction({
      userId: userId,
      postId: req.params.id
    });
    if (!reaction) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Erorr");
    }
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Post reaction success!",
      data: reaction
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const changeStatusPost = async (req, res, next) => {
  try {
    const post = postService.getPost(req.params.id);
    const status = req.body.status;
    let statusNew;
    if (status == "HIDDEN") {
      statusNew = enumStatus.statusPost.HIDDEN;
    } else if (status == "ACTIVE") {
      statusNew = enumStatus.statusPost.ACTIVE;
    } else {
      statusNew = enumStatus.statusPost.LOCKED;
    }

    const changeStatus = await postService.updateStatusPost({
      post: post,
      newStatus: statusNew
    });
    res.status(StatusCodes.OK).json({
      success: true,
      status: StatusCodes.OK,
      data: changeStatus
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await postService.getPost(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }
    if (post.status == enumStatus.statusPost.ACTIVE) {
      res.status(StatusCodes.OK).json({
        success: true,
        status: StatusCodes.OK,
        data: post
      });
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await postService.getPost(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      status: StatusCodes.OK,
      comments: post.comments
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};
const getReaction = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await postService.getPost(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      status: StatusCodes.OK,
      reaction: post.reaction
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

export const postController = {
  addPost,
  postComment,
  addReaction,
  getPost,
  changeStatusPost,
  getComment,
  getReaction,
  deleteComment
};
