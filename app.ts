import path from "path";

import express, { Request, Response, NextFunction } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import get404 from "./controllers/error";
import Product from "./models/product";
import User from "./models/user";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import { userType } from "./customTypes";

const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

declare module "express-serve-static-core" {
  interface Request {
    user: HydratedDocument<userType>;
  }
}
app.use((req: Request, res: Response, next: NextFunction) => {
  User.findById("63df88c90d1336dd17cc79bf")
    .then((user) => {
      req.user = user!;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(`mongodb://mongo:27017/docker-node-mongo`)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
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
