import { sign } from "jsonwebtoken";
import { env } from "~/config/environment";
const generateAuthToken = async function ({account, userId, centerId}) {
  const token = await sign(
    {
      id: account.id,
      email: account.email,
      role: account.role,
      isActive: account.isActive,
      userId: userId,
      centerId: centerId,
      access: true
    },
    env.JWT_SECRET,
    { expiresIn: "5m" }
  );
  return token;
};
const generateRefreshToken = async function ({account, userId, centerId}) {
  const token = await sign(
    {
      id: account.id,
      email: account.email,
      role: account.role,
      isActive: account.isActive,
      userId: userId,
      centerId: centerId,
      access: false
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
