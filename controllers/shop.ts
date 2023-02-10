import { Request, Response, NextFunction } from "express";
import { productType } from "../customTypes";
import Order from "../models/orders";
import Product from "../models/product";

const getProducts = (req: Request, res: Response, next: NextFunction):void => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProduct = (req: Request, res: Response, next: NextFunction): void => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((product) => {
      if (product === null) return;
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (req: Request, res: Response, next: NextFunction): void => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCart = (req: Request, res: Response, next: NextFunction): void => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

const postCart = (req: Request, res: Response, next: NextFunction): void => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (product === null) return;
      req.user.addToCart(product);
    })
    .catch((err: Error) => console.log(err));
  res.redirect("/cart");
};

const postDeleteCartEle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(() => req.user.removeFromCart(prodId));
  res.redirect("/cart");
};

const getOrders = (req: Request, res: Response, next: NextFunction): void => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

const postOrders = (req: Request, res: Response, next: NextFunction): void => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId } };
      });
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      });
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

const getCheckout = (req: Request, res: Response, next: NextFunction): void => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticated: req.session.isLoggedIn
  });
};

export {
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  postOrders,
  getProducts,
  getProduct,
  postCart,
  postDeleteCartEle,
};
