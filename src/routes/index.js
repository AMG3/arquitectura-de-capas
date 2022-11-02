import { Router } from "express";

import { isInSession } from "../middlewares/auth.middleware.js";
import * as productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.handleDefault);
router.get("/add-to-cart/:id", productController.handleAddToCart);
router.get("/reduce/:id", productController.handleReduceByOne);
router.get("/remove/:id", productController.handleRemoveById);
router.get("/shopping-cart", productController.handleShoppingCart);
router.get("/checkout", isInSession, productController.renderCheckout);
router.post("/checkout", isInSession, productController.handleCheckout);

export default router;
