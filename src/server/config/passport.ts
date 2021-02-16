/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import argon2 from "argon2";
import passport from "passport";
import * as passportJwt from "passport-jwt";
import * as passportLocal from "passport-local";

import { cfg } from "../../config";
import { UserRepository } from "../services/users/repository";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

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

          const isValidPassword = await argon2.verify(
            user.password_hash,
            password,
          );

          if (!isValidPassword) {
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
