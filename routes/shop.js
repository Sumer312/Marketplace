"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shop_1 = require("../controllers/shop");
const router = express_1.default.Router();
router.get("/", shop_1.getIndex);
router.get("/products", shop_1.getProducts);
router.get("/product/:id", shop_1.getProduct);
router.post("/cart", shop_1.postCart);
router.get("/cart", shop_1.getCart);
router.get("/orders", shop_1.getOrders);
router.get("/checkout", shop_1.getCheckout);
router.post("/deleteCart", shop_1.postDeleteCartEle);
router.post('/createOrder', shop_1.postOrders);
exports.default = router;
