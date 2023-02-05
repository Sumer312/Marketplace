"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteCartEle = exports.postCart = exports.getProduct = exports.getProducts = exports.postOrders = exports.getOrders = exports.getIndex = exports.getCheckout = exports.getCart = void 0;
const orders_1 = __importDefault(require("../models/orders"));
const product_1 = __importDefault(require("../models/product"));
const getProducts = (req, res, next) => {
    product_1.default.find()
        .then((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.getProducts = getProducts;
const getProduct = (req, res, next) => {
    const prodId = req.params.id;
    product_1.default.findById(prodId)
        .then((product) => {
        if (product === null)
            return;
        res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "/products",
        });
    })
        .catch((err) => console.log(err));
};
exports.getProduct = getProduct;
const getIndex = (req, res, next) => {
    product_1.default.find()
        .then((products) => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.getIndex = getIndex;
const getCart = (req, res, next) => {
    req.user.populate("cart.items.productId").then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
        });
    });
};
exports.getCart = getCart;
const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    product_1.default.findById(prodId)
        .then((product) => {
        if (product === null)
            return;
        req.user.addToCart(product);
    })
        .catch((err) => console.log(err));
    res.redirect("/cart");
};
exports.postCart = postCart;
const postDeleteCartEle = (req, res, next) => {
    const prodId = req.body.productId;
    product_1.default.findById(prodId).then(() => req.user.removeFromCart(prodId));
    res.redirect("/cart");
};
exports.postDeleteCartEle = postDeleteCartEle;
const getOrders = (req, res, next) => {
    orders_1.default.find({ "user.userId": req.user._id })
        .then((orders) => {
        res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: orders,
        });
    })
        .catch((err) => console.log(err));
};
exports.getOrders = getOrders;
const postOrders = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
        const products = user.cart.items.map((i) => {
            return { quantity: i.quantity, product: Object.assign({}, i.productId) };
        });
        const order = new orders_1.default({
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
        });
        return order.save();
    })
        .then(() => {
        return req.user.clearCart();
    })
        .then(() => res.redirect("/orders"))
        .catch((err) => console.log(err));
};
exports.postOrders = postOrders;
const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
exports.getCheckout = getCheckout;
