import { Request, Response, NextFunction } from "express";
import { userType } from "../customTypes";
import User from "../models/user";
import bcrypt from "bcryptjs";

const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  let message = req.flash('error');
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message
  });
};

const postLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.redirect("/login");
      }
      bcrypt
        .compare(password, user!.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user!;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          } else {
            return res.redirect("/login");
          }
        })
        .catch((err) => console.log(err));
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
  let message = req.flash('error');
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message
  });
};

const postSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => res.redirect("/login"));
    })
    .catch((err) => console.log(err));
};

export { getLogin, postLogin, postLogout, getSignup, postSignup };
