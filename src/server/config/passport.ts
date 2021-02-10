import bcrypt from "bcrypt";
import passport from "passport";
import * as passportLocal from "passport-local";
import { UserRepository } from "../services/users/repository";

const LocalStrategy = passportLocal.Strategy;

export function validatePassword(
  password: string,
  password_hash: string,
): boolean {
  return bcrypt.compareSync(password, password_hash);
}

export function setupPassport(repo: UserRepository): void {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
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
      },
    ),
  );
}
