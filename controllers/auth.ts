import { Request, Response, NextFunction } from "express";
import { userType } from "../customTypes";
import User from "../models/user";
import bcrypt from "bcryptjs";

const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

const postLogin = (req: Request, res: Response, next: NextFunction): void => {
  User.findById("63ea91dbb79f0830a2d96bf2")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user!;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err: Error) => console.log(err));
};

const postLogout = (req: Request, res: Response, next: NextFunction): void => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const getSignup = (req: Request, res: Response, next: NextFunction): void => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

const postSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        res.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => res.redirect("/login "))
    .catch((err) => console.log(err));
};

export { getLogin, postLogin, postLogout, getSignup, postSignup };
