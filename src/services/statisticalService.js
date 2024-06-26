import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const statisticalYear = async function (year, centerId) {
    const centerIdObj = new mongoose.Types.ObjectId(centerId);
    const data = await Order.aggregate([
        {
            $match: {
                statusOrder: "COMPLETED",
                "seller.centerId": centerIdObj,
                dateCompleted: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$dateCompleted" } },
                total: { $sum: "$totalPayment" },
                paid: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$statusPayment", "PAID"] },
                            then: "$totalPayment",
                            else: 0
                        }
                    }
                },
                pending: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$statusPayment", "PENDING"] },
                            then: "$totalPayment",
                            else: 0
                        }
                    }
                }
            }
        }
    ]);
    // Create a result array for all months
    let result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0, paid: 0, pending: 0 }));

    // Fill the result array with the data from the aggregation
    for (let item of data) {
        result[item._id.month - 1] = { month: item._id.month, total: item.total, paid: item.paid, pending: item.pending };
    }

    return result;
};

const statisticalYearMonth = async function (year, month, centerId) {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const centerIdObj = new mongoose.Types.ObjectId(centerId);
    // Adjust month for JavaScript's 0-indexed months if necessary
    const adjustedMonth = month - 1;
    let data = await Order.aggregate([
        {
            $match: {
                statusOrder: "COMPLETED",
                "seller.centerId": centerIdObj,
                dateCompleted: {
                    $gte: new Date(year, adjustedMonth, 1),
                    $lt: new Date(year, adjustedMonth, lastDayOfMonth + 1)
                }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfMonth: "$dateCompleted" } },
                total: { $sum: "$totalPayment" },
                paid: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$statusPayment", "PAID"] },
                            then: "$totalPayment",
                            else: 0
                        }
                    }
                },
                pending: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$statusPayment", "PENDING"] },
                            then: "$totalPayment",
                            else: 0
                        }
                    }
                }
            }
        }
    ]);

    // Create a result array for all days
    let result = Array.from({ length: lastDayOfMonth }, (_, i) => ({ day: i + 1, total: 0, paid: 0, pending: 0 }));

    // Fill the result array with the data from the aggregation
    for (let item of data) {
        result[item._id.day - 1] = { day: item._id.day, total: item.total, paid: item.paid, pending: item.pending };
    }

    return result;
};
export const statisticalService = {
    statisticalYear,
    statisticalYearMonth
}