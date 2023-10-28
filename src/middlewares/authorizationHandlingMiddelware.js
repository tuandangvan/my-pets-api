import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import { petService } from "~/services/petService";
import { postService } from "~/services/postService";
import PermissionRoles from "~/utils/rolePermission";
import { _ } from "lodash";

const permission = (permission) => {
  return async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);

    const userId = req.params.userId;
    const centerId = req.params.centerId;
    const petId = req.params.petId;
    const postId = req.params.postId;

    if (_.isEqual(permission, PermissionRoles.All)) {
      next();
      return;
    }

    if (!permission.includes(data.role)) {
      return res.status(401).json({ error: "You don't permission!" });
    }

    if (centerId) {
      if (!centerId.includes(data.centerId)) {
        return res.status(401).json({ error: "You don't permission!" });
      }
    } else if (userId) {
      if (!userId.includes(data.userId)) {
        return res.status(401).json({ error: "You don't permission!" });
      }
    } else if (petId) {
      const pet = await petService.findPetById(petId);
      const centerIdTemp = pet.centerId.toString();
      if (!centerIdTemp.includes(data.centerId)) {
        return res.status(401).json({ error: "You don't permission!" });
      }
    } else if (postId) {
      const post = await postService.findPostById(id);
      const centerIdTemp = post.centerId.toString();
      const userIdTemp = post.userId.toString();
      if (
        (!centerIdTemp.includes(data.centerId) && !userIdTemp) ||
        (!userIdTemp.includes(data.userId) && !centerIdTemp)
      ) {
        return res.status(401).json({ error: "You don't permission!" });
      }
    }
    next();
    return;
  };
};

export const authorizationMiddelware = {
  permission
};
