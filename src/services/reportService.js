import mongoose from "mongoose";
import Report from "../models/reportModel";

const reportPost = async function (data) {
  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    ...data
  });
  return report.save();
};

const findReportByPostIdDestinate = async function (idDestinate, commentId) {
    const report = await Report.findOne({ idDestinate: idDestinate, commentId: commentId });
    return report;
}

const addReport = async function (reportId, reporter) {
    const report = await Report.updateOne({_id: reportId}, {$push: {reporter: reporter}});
    return report;
}

export const reportService = {
  reportPost,
  findReportByPostIdDestinate,
  addReport
};
