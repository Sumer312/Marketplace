import express from "express";

import {
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  getProducts,
  getProduct,
  postCart,
  postDeleteCartEle,
  postOrders
} from "../controllers/shop";

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/product/:id", getProduct);

router.post("/cart", postCart);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

router.post("/deleteCart", postDeleteCartEle);

router.post('/create-order', postOrders);


export default router;
