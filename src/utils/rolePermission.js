import { enums } from "~/enums/enums";

export default class PermissionRoles {
  static get All() {
    return [enums.roles.USER, enums.roles.CENTER, enums.roles.ADMIN];
  }
  static get User_Center() {
    return [enums.roles.USER, enums.roles.CENTER];
  }
  static get User_Admin() {
    return [enums.roles.USER, enums.roles.ADMIN];
  }
  static get Center_Admin() {
    return [enums.roles.CENTER, enums.roles.ADMIN];
  }
  static get onlyUser() {
    return [enums.roles.USER];
  }
  static get onlyCenter() {
    return [enums.roles.CENTER];
  }
  static get onlyAdmin() {
    return [enums.roles.ADMIN];
  }
}
