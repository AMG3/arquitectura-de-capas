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

  async save(newOrder) {
    const order = new Order(newOrder);
    try {
      await order.save();
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }
}
