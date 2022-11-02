import Order from "../dao/order.js";
import { logger } from "../handlers/logger.js";

export class OrderService {
  async getOrders(user) {
    try {
      return await Order.find({ user });
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }
}
