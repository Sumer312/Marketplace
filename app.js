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
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const auth_1 = __importDefault(require("./routes/auth"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const MONGO_URI = "mongodb://mongo:27017/docker-node-mongo";
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: "sessions",
});
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_session_1.default)({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    user_1.default.findById(req.session.user._id) //"63df88c90d1336dd17cc79bf"
        .then((user) => {
        req.user = user;
        next();
    })
        .catch((err) => console.log(err));
});
app.use("/admin", admin_1.default);
app.use(shop_1.default);
app.use(auth_1.default);
app.use(error_1.default);
mongoose_1.default
    .connect(MONGO_URI)
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
