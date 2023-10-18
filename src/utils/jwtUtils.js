import { sign } from "jsonwebtoken";
import { env } from "~/config/environment";
const generateAuthToken = async function ({ _id, name }) {
  const token = await sign(
    {
      _id: _id,
      name: name
    },
    env.JWT_SECRET,
    { expiresIn: "60000" }
  );
  return token;
};
const generateRefreshToken = async function ({ _id, name }) {
  const token = await sign(
    {
      _id: _id,
      name: name
    },
    env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return token;
};
export const jwtUtils = {
  generateAuthToken,
  generateRefreshToken
};
