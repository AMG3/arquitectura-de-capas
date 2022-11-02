import { Cart } from "../dao/cart.js";
import Order from "../dao/order.js";
import Product from "../dao/product.js";
import User from "../dao/user.js";
import { sendEmail } from "../handlers/email.js";
import { checkoutTemplate } from "../constants/templates.js";

export async function handleDefault(req, res, next) {
  const successMsg = req.flash("success")[0];
  Product.find((err, docs) => {
    const productChunks = docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      picture: doc.picture,
      price: doc.price,
    }));
    res.render("shop/index", {
      title: "E-commerce",
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg,
    });
  });
}

export async function handleAddToCart(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/");
  });
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
    totalPrice: cart.totalPrice,
  });
}

export async function renderCheckout(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash("error")[0];
  res.render("shop/checkout", {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg,
  });
}

export async function handleCheckout(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }

  const cart = new Cart(req.session.cart);

  User.findById(req.session.passport.user, (err, user) => {
    const newOrder = {
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: Math.random().toString(32),
    };
    const order = new Order(newOrder);

    console.log("Enviado a:", user.email);
    sendEmail(user.email, "Tu orden", checkoutTemplate(newOrder));

    order.save((err, result) => {
      req.flash("success", "Compra exitosa de producto");
      req.session.cart = null;
      res.redirect("/");
    });
  });
}
