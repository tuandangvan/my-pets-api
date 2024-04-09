import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const statisticalYear = async function (year, centerId) {
    const centerIdObj = new mongoose.Types.ObjectId(centerId);
    const data = await Order.aggregate([
        {
            $match: {
                statusOrder: "COMPLETED",
                "seller.centerId": centerIdObj,
                updatedAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$updatedAt" } },
                total: { $sum: "$totalPayment" }
            }
        }
    ]);
    // Create a result array for all months
    let result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));

    // Fill the result array with the data from the aggregation
    for (let item of data) {
        result[item._id.month - 1] = { month: item._id.month, total: item.total };
    }

    return result;
};

const statisticalYearMonth = async function (year, month, centerId) {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const centerIdObj = new mongoose.Types.ObjectId(centerId);

    let data = await Order.aggregate([
        {
            $match: {
                statusOrder: "COMPLETED",
                "seller.centerId": centerIdObj,
                updatedAt: { $gte: new Date(`${year}-${month}-01`), $lt: new Date(`${year}-${month}-${lastDayOfMonth + 1}`) }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfMonth: "$updatedAt" } },
                total: { $sum: "$totalPayment" }
            }
        }
    ]);

    // Create a result array for all days
    let result = Array.from({length: lastDayOfMonth}, (_, i) => ({day: i+1, total: 0}));

    // Fill the result array with the data from the aggregation
    for(let item of data) {
        result[item._id.day - 1] = {day: item._id.day, total: item.total};
    }

    return result;
};
export const statisticalService = {
    statisticalYear,
    statisticalYearMonth
}