export default class ErorrToken {
    static get tokenExpired() {
      return "Invalid JWT!";
    }
    static get tokenNotFound() {
      return "Token not found!";
    }
    static get tokenNotAccess() {
      return "Token does not allow access!";
    }
    static get tokenNotRefresh() {
        return "Token does not allow refresh!";
      }
  }
  
  