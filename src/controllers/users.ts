import express from "express";
import User from "../models/User";
import utils from "../utils";

export function auth(req: express.Request, res: express.Response): void {
  info(req, res);
}

export function info(req: express.Request, res: express.Response): void {
  utils.respond(res, { user: (<User>req.user).sanitize() });
}

export function register(req: express.Request, res: express.Response): void {
  const email: string = req.body.email;
  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!email || !username || !password)
    return utils.respond(res, 400, "Missing arguments!");
  if (email.length > 40)
    return utils.respond(res, 400, "Email longer than 40 characters!");
  if (password.length < 8)
    return utils.respond(res, 400, "Password shorter than 8 characters!");

  User.isEmailTaken(email)
    .then((taken) => {
      if (taken) return utils.respond(res, 400, "email_taken");
      User.isUsernameTaken(username)
        .then((taken) => {
          if (taken) return utils.respond(res, 400, "username_taken");
          User.make(email, username, password)
            .then(() => utils.respond(res))
            .catch((err) => utils.respond(res, 500, "other_error", err));
        })
        .catch((err) => utils.respond(res, 500, "other_error", err));
    })
    .catch((err) => utils.respond(res, 500, "other_error", err));
}

export function logout(req: express.Request, res: express.Response): void {
  req.logout();
  utils.respond(res);
}
