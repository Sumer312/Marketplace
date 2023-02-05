"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const router = express_1.default.Router();
// /admin/add-product => GET
router.get("/add-product", admin_1.getAddProduct);
// /admin/products => GET
router.get("/products", admin_1.getProducts);
// /admin/add-product => POST
router.post("/add-product", admin_1.postAddProduct);
router.get("/edit-product/:productId", admin_1.getEditProduct);
router.post("/edit-product", admin_1.postEditProduct);
router.post("/delete-product", admin_1.postDeleteProduct);
exports.default = router;
