import { Cart } from "../dao/cart.js";
import { sendEmail } from "../handlers/email.js";
import { checkoutTemplate } from "../constants/templates.js";
import { ProductService } from "../services/product.service.js";
import { UserService } from "../services/user.service.js";
import { OrderService } from "../services/order.service.js";

const productService = new ProductService();
const userService = new UserService();
const orderService = new OrderService();

export async function handleDefault(req, res, next) {
  const successMsg = req.flash("success")[0];
  try {
    const products = await productService.getProducts();

    const productChunks = products.map(({ id, title, picture, price }) => ({
      id,
      title,
      picture,
      price,
    }));

    res.render("shop/index", {
      title: "E-commerce",
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg,
    });
  } catch (error) {
    return res.redirect("/");
  }
}

export async function handleAddToCart(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  try {
    const product = await productService.findById(productId);
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/");
  } catch (error) {
    return res.redirect("/");
  }
}

export async function handleReduceByOne(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
}

export async function handleRemoveById(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
}

export async function handleShoppingCart(req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice.toFixed(2),
  });
}

export async function renderCheckout(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash("error")[0];
  res.render("shop/checkout", {
    total: cart.totalPrice.toFixed(2),
    errMsg: errMsg,
    noError: !errMsg,
  });
}

export async function handleCheckout(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }

  const cart = new Cart(req.session.cart);

  try {
    const user = await userService.findById(req.session.passport.user);
    const newOrder = {
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: Math.random().toString(32),
    };

    console.log("Enviado a:", user.email);
    sendEmail(user.email, "Tu orden", checkoutTemplate(newOrder));
    await orderService.save(newOrder);
    req.flash("success", "Compra exitosa de producto");
    req.session.cart = null;
    res.redirect("/");
  } catch (error) {
    return res.redirect("/");
  }
}
