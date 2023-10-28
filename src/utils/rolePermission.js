import { enums } from "~/enums/enums";

export default class PermissionRoles {
  static get permissionAll() {
    return [enums.roles.USER, enums.roles.CENTER, enums.roles.ADMIN];
  }
  static get permissionU_C() {
    return [enums.roles.USER, enums.roles.CENTER];
  }
  static get permissionU_A() {
    return [enums.roles.USER, enums.roles.ADMIN];
  }
  static get permissionC_A() {
    return [enums.roles.CENTER, enums.roles.ADMIN];
  }
}
