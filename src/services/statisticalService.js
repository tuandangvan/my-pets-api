import Order from "../models/orderModel.js";

const statisticalYear = async function (year, centerId) {

    const data = await Order.aggregate([
        {
            $match: {
                statusOrder: "COMPLETED",
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

    // const data = await Order.find({
    //     "seller.centerId": centerId,
    //     statusOrder: "COMPLETED",
    //     createdAt: {
    //         $gte: new Date(`${year}-01-01`),
    //         $lte: new Date(`${year}-12-31`)
    //     }
    // });
    return data;
};

export const statisticalService = {
    statisticalYear
}