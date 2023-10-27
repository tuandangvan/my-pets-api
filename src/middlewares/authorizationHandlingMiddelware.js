import { verify } from "jsonwebtoken";
import { env } from "~/config/environment"; 
const permission = (permission) => {
  return (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);

    if (!permission.includes(data.role)) {
      return res.status(401).json({ error: "You don't permission!" });
    }
    next();
    return;
  };
};

export const authorizationMiddelware = {
  permission
};
