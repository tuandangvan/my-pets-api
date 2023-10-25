import { sign } from "jsonwebtoken";
import { env } from "~/config/environment";
const generateAuthToken = async function ({account, userId}) {
  const token = await sign(
    {
      id: account.id,
      email: account.email,
      role: account.role,
      isActive: account.isActive,
      userId: userId
    },
    env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return token;
};
const generateRefreshToken = async function ({account, userId}) {
  const token = await sign(
    {
      id: account.id,
      email: account.email,
      role: account.role,
      isActive: account.isActive,
      userId: userId
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};
export const jwtUtils = {
  generateAuthToken,
  generateRefreshToken
};
