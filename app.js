"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = __importDefault(require("./controllers/error"));
const user_1 = __importDefault(require("./models/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "views");
app.use((req, res, next) => {
    user_1.default.findById("63df88c90d1336dd17cc79bf")
        .then((user) => {
        req.user = user;
        next();
    })
        .catch((err) => console.log(err));
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/admin", admin_1.default);
app.use(shop_1.default);
app.use(error_1.default);
mongoose_1.default
    .connect(`mongodb://mongo:27017/docker-node-mongo`)
    .then(() => {
    user_1.default.findOne().then((user) => {
        if (!user) {
            const user = new user_1.default({
                name: "Max",
                email: "max@test.com",
                cart: {
                    items: [],
                },
            });
            user.save();
        }
    });
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})
    .catch((err) => {
    console.log(err);
});
