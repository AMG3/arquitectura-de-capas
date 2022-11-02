import Product from "../dao/product.js";

export class ProductService {
  async getProducts() {
    try {
      return await Product.find();
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }
}
