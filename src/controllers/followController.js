import { verify } from 'jsonwebtoken';
import { env } from '../config/environment';
import { userService } from '../services/userService';
import { centerService } from '../services/centerService';
import { token } from '../utils/token';
import { StatusCodes } from 'http-status-codes';


const follow = async (req, res, next) => {
    try {
        const userId = req.body.userId || null;
        const centerId = req.body.centerId || null;

        const getToken = await token.getTokenHeader(req);
        const decodeToken = verify(getToken, env.JWT_SECRET);
        const userIdFL = decodeToken.userId;
        const centerIdFL = decodeToken.centerId;
        var status;
        if (userId) {
            status = await userService.followUser(userId, userIdFL, centerIdFL);
        } else {
            status = await centerService.followCenter(centerId, userIdFL, centerIdFL);
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: status + " successfully"
        });
    } catch (error) {
        next(error);
    }
};

const getMyFollowCenter = async (req, res, next) => {
    try {
        const getToken = await token.getTokenHeader(req);
        const decodeToken = verify(getToken, env.JWT_SECRET);
        const userId = decodeToken.userId;
        const centerId = decodeToken.centerId;
        if (userId) {
            const user = await userService.getMyFollow(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Get list follow successfully",
                data: user
            });
        } else {
            const center = await centerService.getMyFollow(centerId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Get list follow successfully",
                data: center
            });
        }
    } catch (error) {
        next(error);
    }
};

const getFollower = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userService.getFollower(id);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Get list follower successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const getFollowing = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userService.getFollowing(id);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Get list following successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const followController = {
    follow,
    getMyFollowCenter,
    getFollower,
    getFollowing
}