import { setupPassportJwt } from "../../config/passport";
import passport from "passport";
import { UserRepository } from "../users/repository";
import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { NextFunction, Request, Response } from "express";

const repo = new UserRepository();

setupPassportJwt(repo);

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new AppError(
        commonHTTPErrors.notAuthenticated,
        "Invalid token",
        true,
      );
    }

    req.user = user;

    return next();
  })(req, res, next);
};

export default authMiddleware;
