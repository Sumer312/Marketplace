import path from "path";

import express, { Request, Response, NextFunction } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import get404 from "./controllers/error";
import User from "./models/user";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import { userType } from "./customTypes";

declare module "express-serve-static-core" {
  interface Request {
    user: HydratedDocument<userType>;
  }
}

declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    user: HydratedDocument<userType>;
  }
}

const PORT = process.env.PORT || 3000;

const app = express();

const MongoDBStore = connectMongoDBSession(session);

const MONGO_URI: string = "mongodb://mongo:27017/docker-node-mongo";

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id) //"63df88c90d1336dd17cc79bf"
    .then((user) => {
      req.user = user!;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Max",
    //       email: "max@test.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
