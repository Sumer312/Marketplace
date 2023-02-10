import { Request, Response, NextFunction } from "express";
import { userType } from "../customTypes";
import User from "../models/user";

const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: true,
  });
};

const postLogin = (req: Request, res: Response, next: NextFunction): void => {
  User.findById("63df88c90d1336dd17cc79bf")
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
    path:"/signup",
    pageTitle:"Signup",
    isLoggedIn:false
  });
};

const postSignup = (req: Request, res: Response, next: NextFunction): void => {

}

export { getLogin, postLogin, postLogout, getSignup, postSignup };
