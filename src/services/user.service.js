import User from "../dao/user.js";

export class UserService {
  async findById(id) {
    try {
      return User.findById(id);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }
}
