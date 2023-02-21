import path from "path";

import express, { Request, Response, NextFunction, Express } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import get404 from "./controllers/error";
import User from "./models/user";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import { DestinationCallback, FileNameCallback } from "./customTypes";
import flash from "connect-flash";
import multer, { FileFilterCallback } from "multer";

const PORT = process.env.PORT || 3000;

const app = express();

const MongoDBStore = connectMongoDBSession(session);

const MONGO_URI: string = "mongodb://mongo:27017/docker-node-mongo";

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const date: string = new Date().toISOString();
    cb(null, date.replace(/:/g , "-") + file.originalname.toString());
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(flash());
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
