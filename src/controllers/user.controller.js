import { Cart } from "../dao/cart.js";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export async function getProfile(req, res) {
  try {
    const orders = await orderService.getOrders(req.user);
    const userOrders = [];

    orders.forEach((order) => {
      let cart = new Cart(order.cart);
      userOrders.push({
        cart,
        items: cart.generateArray(),
      });
    });

    res.render("user/profile", {
      orders: userOrders,
      userPhoto: `../files/${req.user.photo}`,
      userName: req.user.first_name,
    });
  } catch (error) {
    return res.write("Error!");
  }
}

export async function handleLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export async function handleDefault(req, res, next) {
  next();
}

export async function renderSignUp(req, res, next) {
  const messages = req.flash("error");
  res.render("user/signup", {
    messages: messages,
    hasErrors: messages.length > 0,
  });
}

export async function handleSignUp(req, res, next) {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/user/profile");
  }
}

export async function renderSignIn(req, res, next) {
  const messages = req.flash("error");
  res.render("user/signin", {
    messages: messages,
    hasErrors: messages.length > 0,
  });
}

export async function handleSignIn(req, res, next) {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/user/profile");
  }
}
