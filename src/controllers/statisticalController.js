import { statisticalService } from "../services/statisticalService";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { token } from "../utils/token";
import { verify } from "jsonwebtoken";
import { env } from "../config/environment";


const statisticalYear = async (req, res, next) => {
    try {
        const getToken = await token.getTokenHeader(req);
        const decodeToken = verify(getToken, env.JWT_SECRET);
        const year = req.query.y;
        const data = await statisticalService.statisticalYear(year, decodeToken.centerId);
        res.status(StatusCodes.OK).json({
            success: true,
            data: data
        });
    } catch (error) {
        const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        next(customError);
    }

}

export const statisticalController = {
    statisticalYear
};