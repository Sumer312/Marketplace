"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteProduct = exports.postEditProduct = exports.getEditProduct = exports.getAddProduct = exports.postAddProduct = exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};
exports.getAddProduct = getAddProduct;
const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const Id = req.user;
    const product = new product_1.default({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: Id
    });
    product
        .save()
        .then(() => {
        console.log("Data successfully saved");
        res.redirect("/");
    })
        .catch((err) => console.log(err));
};
exports.postAddProduct = postAddProduct;
const getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    product_1.default.findById(prodId)
        .then((product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product,
        });
    })
        .catch((err) => console.log(err));
};
exports.getEditProduct = getEditProduct;
const postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    product_1.default.findById(prodId)
        .then((product) => {
        if (product === null) {
            return;
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
        .then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
    })
        .catch((err) => console.log(err));
};
exports.postEditProduct = postEditProduct;
const getProducts = (req, res, next) => {
    product_1.default.find()
        .populate("userId")
        .then((products) => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
        });
    })
        .catch((err) => console.log(err));
};
exports.getProducts = getProducts;
const postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    product_1.default.findByIdAndDelete(prodId)
        .then(() => {
        console.log("DESTROYED PRODUCT");
        res.redirect("/admin/products");
    })
        .catch((err) => console.log(err));
};
exports.postDeleteProduct = postDeleteProduct;
