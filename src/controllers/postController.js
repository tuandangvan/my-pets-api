import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import { enums } from "~/enums/enums";
import ErorrPost from "~/messageError/erorrPost";
import { postService } from "~/services/postService";
import ApiError from "~/utils/ApiError";
import { setEnum } from "~/utils/setEnum";
import { token } from "~/utils/token";

const addPost = async (req, res, next) => {
  try {
    const post = req.body;
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const newPost = await postService.createPost({
      data: post,
      userId: decodeToken.userId,
      centerId: decodeToken.centerId
    });
    if (newPost) {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Posted successfully!",
        postId: newPost.id
      });
    } else {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Posting failed!"
      });
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    next(customError);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const newPost = req.body;
    const postId = req.params.postId;
    const oldPost = await postService.findPostById(postId);
    if (!oldPost) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
    await postService.updatePost({ postId: oldPost.id, data: newPost });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Post updated successfully!"
    });
  } catch (erorr) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, erorr.message));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const oldPost = await postService.findPostById(postId);
    if (!oldPost) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
    await postService.deletePostDB(postId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Post deleted successfully!"
    });
  } catch (erorr) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, erorr.message));
  }
};

const reactionPost = async (req, res, next) => {
  try {
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const postId = req.params.postId;
    const post = await postService.findPostById(postId);
    if (!post || (post && post.status != enums.statusPost.ACTIVE)) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
    const userId = decodeToken.userId;
    const centerId = decodeToken.centerId;
    const reaction = await postService.reaction({
      post: post,
      userId: userId,
      centerId: centerId
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
    const postId = req.params.postId;
    const post = await postService.findPostById(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
    const status = req.body.status;
    const statusNew = await setEnum.setStatusPost(status);

    const changeStatus = await postService.updateStatusPost({
      post: post,
      newStatus: statusNew
    });
    res.status(StatusCodes.OK).json({
      success: true,
      data: changeStatus
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const getToken = await token.getTokenHeader(req);
    const decodeToken = verify(getToken, env.JWT_SECRET);
    const post = await postService.findPostInfoById(postId);
    if (!post) {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
    let check = false;
    if (post.status == enums.statusPost.ACTIVE) check = true;
    if (post.status == enums.statusPost.HIDDEN) {
      if (post.centerId) {
        if (
          post.centerId.id == decodeToken.centerId &&
          decodeToken.userId == null
        )
          check = true;
      }
      if (post.userId) {
        if (
          post.userId.id == decodeToken.userId &&
          decodeToken.centerId == null
        )
          check = true;
      }
    }
    if (check) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: post
      });
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, ErorrPost.postNotFound);
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

// const getReaction = async (req, res, next) => {
//   try {
//     const postId = req.params.id;
//     const post = await postService.getPost(postId);
//     if (!post) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Not found post!");
//     }
//     res.status(StatusCodes.OK).json({
//       success: true,
//       status: StatusCodes.OK,
//       reaction: post.reaction
//     });
//   } catch (error) {
//     const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
//     next(customError);
//   }
// };

export const postController = {
  addPost,
  updatePost,
  deletePost,
  reactionPost,
  getPost,
  changeStatusPost,
  // getReaction
};
