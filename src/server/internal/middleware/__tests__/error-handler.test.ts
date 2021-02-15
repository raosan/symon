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

import express from "express";
import request from "supertest";
import { logger } from "../../logger";
import { AppError, commonHTTPErrors } from "../../app-error";
import errorHandler from "../error-handler";

jest.mock("../../logger");
const logError = jest.fn();
logger.error = logError;

describe("Error handler middleware", () => {
  describe("Trusted error", () => {
    it("should return http status 422", async () => {
      // arrange
      const app = express();
      const errorMessage = "Data is not found";

      app.get("/v1/users", (_, __, next) => {
        const err = new AppError(
          commonHTTPErrors.unprocessableEntity,
          errorMessage,
          true,
        );
        next(err);
      });
      app.use(errorHandler());

      // act
      const res = await request(app).get("/v1/users");

      // assert
      expect(res.status).toBe(422);
      expect(logError).toHaveBeenCalledWith(errorMessage);
    });

    it("should skip middleware if it is not error", async () => {
      // arrange
      const app = express();

      app.use(errorHandler());

      // act
      const res = await request(app).get("/v1/users");

      // assert
      expect(res.status).toBe(404);
    });
  });

  describe("Untrusted Error", () => {
    it("should crash because untrusted error", async () => {
      // arrange
      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => null) as () => never);
      const app = express();
      const errorMessage = "Out of memory";

      app.get("/v1/users", (_, __, next) => {
        const err = new AppError(
          commonHTTPErrors.unprocessableEntity,
          errorMessage,
          false,
        );
        next(err);
      });
      app.use(errorHandler());

      // act
      await request(app).get("/v1/users");

      // assert
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(logError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
