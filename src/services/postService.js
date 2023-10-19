import mongoose from "mongoose";
import Post from "~/models/postModel";

const createPost = async function ({ data, userId }) {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    ...data,
    userId: userId
  });
  return post.save();
};

const createComment = async function ({ data, postId }) {
  const newData = {
    _id: new mongoose.Types.ObjectId(),
    content: data.content,
    userId: data.userId
  };
  const comment = await Post.updateOne(
    { id: postId },
    { $push: { comments: newData } }
  );
  return comment;
};

const deleteComment = async function ({ post, userId, commentId }) {
  const index = post.comments.findIndex(
    (element) => element.userId == userId && element._id == commentId
  );
  console.log(commentId)
  console.log(post.id)
  if (index >= 0) {
    const commentNeedDel = post.comments[index];  
    const postDelete = await Post.updateOne(
      { _id: post.id },
      { $pull: { comments: {_id: commentId} } }
    );
    //hoặc
    // const postDelete = await Post.updateOne(
    //   { _id: post.id },
    //   { $pull: { comments: commentNeedDel } }
    // );
    return postDelete;
  }
  return null;
};

const reaction = async function ({ userId, postId }) {
  const post = await Post.findOne({ _id: postId });
  let reaction;
  //count reaction
  let count = post.reaction.length;
  const index = post.reaction.findIndex((element) => element == userId);
  if (post.reaction[index] == userId) {
    //xóa nếu tồn tại
    reaction = await Post.updateOne(
      { _id: postId },
      { $pull: { reaction: userId } }
    );
    count -= 1;
  } else {
    //thêm nếu chưa tồn tại
    reaction = await Post.updateOne(
      { _id: postId },
      { $push: { reaction: userId } }
    );
    count += 1;
  }
  //   console.log(count);
  return reaction;
};

const updateStatusPost = async function ({ post, newStatus }) {
  const postNew = await Post.updateOne({ id: post.id }, { status: newStatus });
  return postNew;
};

const getPost = async function (postId) {
  const post = await Post.findOne({ _id: postId });
  return post;
};

export const postService = {
  createPost,
  createComment,
  reaction,
  updateStatusPost,
  getPost,
  deleteComment
};
