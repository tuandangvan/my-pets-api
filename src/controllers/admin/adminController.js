import { StatusCodes } from "http-status-codes";
import { petService } from "../../services/petService.js";
import { userService } from "../../services/userService.js";
import ApiError from "../../utils/ApiError.js";
import { centerService } from "../../services/centerService.js";
import { accountService } from "../../services/accountService.js";
import ErrorAccount from "../../messageError/errorAccount.js";
import { postService } from "../../services/postService.js";
import { notifyService } from "../../services/notifyService.js";

const getAllUser = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllCenter = async (req, res, next) => {
  try {
    const centers = await centerService.findAllCenterByIdAD();
    res.status(StatusCodes.OK).json({
      success: true,
      data: centers
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petService.findAll();
    res.status(StatusCodes.OK).json({
      success: true,
      data: pets
    });
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const lockAndUnLockAcc = async (req, res, next) => {
  try {
    const status = req.body.status;
    const email = req.body.email;
    const acc = await accountService.findAccountByEmail(email);
    if (!acc) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: ErrorAccount.accountNotFound
      });
    }
    const user = await userService.findUserByAccountId(acc.id);
    if (user) {
      await accountService.changeStatus(acc.id, status);
      await postService.changeStatusAcc(user.id, true, status);
      res.status(StatusCodes.OK).json({
        success: true,
        message: `Change ${status} successfully!`
      });
    } else {
      const center = await centerService.findCenterByAccountId(acc.id);
      if (center) {
        await accountService.changeStatus(acc.id, status);
        await postService.changeStatusAcc(center.id, false, status);
        res.status(StatusCodes.OK).json({
          success: true,
          message: `Change ${status} successfully!`
        });
      } else {
        res.status(StatusCodes.FAILED_DEPENDENCY).json({
          success: false,
          message: `Change ${status} failed!`
        });
      }
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

const handleReport = async (req, res, next) => {
  try {
    const reportId = req.params.reportId;
    const handleReport = req.body.handleReport;
    const report = await userService.findReportById(reportId);
    const post = await postService.findPostById(report.idDestinate);

    var receivers = [];
    await Promise.all(
      (report.reporter).map(async (report) => {
        receivers.push({
          userId: report.userId,
          centerId: report.centerId
        });
      })
    );

    if (handleReport == "LOCKED") {
      await userService.changeStatusReport(report.id, "HANDLED");
      await postService.updateStatusPost(post, "LOCKED");

      //notice owner post
      await notifyService.createNotify({
        title: "Report",
        receiver: [{
          userId: post.userId,
          centerId: post.centerId
        }],
        name: 'Administrator',
        avatar: 'https://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg',
        content: "Your post has been locked!",
        idDestinate: post.id,
        allowView: true
      });

      //notice reporter
      await notifyService.createNotify({
        title: "Report",
        receiver: receivers,
        name: 'Administrator',
        avatar: 'https://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg',
        content: "The post you reported has been locked!",
        idDestinate: post.id,
        allowView: true
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: `${handleReport} successfully!`
      });
    } else if (handleReport == "DELETE") {
      await userService.changeStatusReport(report.id, "HANDLED");
      await postService.deletePostDB(post.id);

      //notice owner post
      await notifyService.createNotify({
        title: "Report",
        receiver: [{
          userId: post.userId,
          centerId: post.centerId
        }],
        name: 'Administrator',
        avatar: 'https://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg',
        content: "Your post has been deleted!",
        idDestinate: post.id,
        allowView: true
      });

      await notifyService.createNotify({
        title: "Report",
        receiver: receivers,
        name: 'Administrator',
        avatar: 'https://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg',
        content: "The post you reported has been deleted!",
        idDestinate: post.id,
        allowView: true
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: `${handleReport} successfully!`
      });
    } else if (handleReport == "REJECT") {
      await userService.changeStatusReport(report.id, "REJECTED");
      await notifyService.createNotify({
        title: "Report",
        receiver: receivers,
        name: 'Administrator',
        avatar: 'https://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg',
        content: "The post you reported has been rejected!",
        idDestinate: post.id,
        allowView: true
      });
      res.status(StatusCodes.OK).json({
        success: true,
        message: `${handleReport} successfully!`
      });
    }
  } catch (error) {
    const customError = new ApiError(StatusCodes.BAD_REQUEST, error.message);
    next(customError);
  }
};

export const adminController = {
  getAllUser,
  getAllCenter,
  getAllPets,
  lockAndUnLockAcc,
  handleReport
};
