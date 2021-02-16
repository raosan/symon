import bcrypt from "bcrypt";
import passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJwt from "passport-jwt";
import { UserRepository } from "../services/users/repository";
import { cfg } from "../../config";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

export function validatePassword(
  password: string,
  password_hash: string,
): boolean {
  return bcrypt.compareSync(password, password_hash);
}

export function setupPassport(repo: UserRepository): void {
  const options = {
    usernameField: "email",
    passwordField: "password",
  };

  passport.use(
    new LocalStrategy(options, (email, password, done) => {
      repo
        .findOneByEmail(email)
        .then(async user => {
          if (!user) {
            return done(null, false, { message: "Email not found." });
          }

          if (!validatePassword(password, user.password_hash)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        })
        .catch(done);
    }),
  );
}

export function setupPassportJwt(repo: UserRepository): void {
  const options = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.jwtSecret,
    issuer: cfg.jwtIssuer,
  };

  passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
      repo
        .findOneByEmail(jwtPayload.sub)
        .then(async user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          if (err) {
            return done(err, false);
          }
        });
    }),
  );
}
