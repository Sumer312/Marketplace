import express from "express";
import isAuth from "../middleware/isAuth";

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

router.get("/", isAuth, getIndex);

router.get("/products", isAuth, getProducts);

router.get("/product/:id", isAuth, getProduct);

router.post("/cart", isAuth, postCart);

router.get("/cart", isAuth, getCart);

router.get("/orders", isAuth, getOrders);

router.get("/checkout", isAuth, getCheckout);

router.post("/deleteCart", isAuth, postDeleteCartEle);

router.post('/createOrder', isAuth, postOrders);


export default router;
