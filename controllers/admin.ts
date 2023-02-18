import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import { HydratedDocument } from "mongoose";
import { productType } from "../customTypes";

const getAddProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postAddProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const Id = req.user;
  const product: HydratedDocument<productType> = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: Id,
  });
  product
    .save()
    .then(() => {
      console.log("Data successfully saved");
      res.redirect("/");
    })
    .catch((err: Error) => console.log(err));
};

const getEditProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (product === null || product.userId.toString() !== req.user._id.toString()) {
        return;
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err: Error) => console.log(err));
};

const postEditProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      if (product === null || product.userId.toString() !== req.user._id.toString()) {
        return;
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })
    .catch((err: Error) => console.log(err));
};

const getProducts = (req: Request, res: Response, next: NextFunction): void => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err: Error) => console.log(err));
};

const postDeleteProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err: Error) => console.log(err));
};

export {
  getProducts,
  postAddProduct,
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
