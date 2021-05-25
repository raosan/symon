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

import { reportRequests } from "@prisma/client";
import express from "express";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import reportRequestService from "../index";
import PrismaClient from "../../../prisma/prisma-client";

describe("Report request service", () => {
  // arrange
  const reportRequestData = [
    {
      id: 1,
      reportId: 1,
      probeId: "GET example.com",
      requestMethod: "GET",
      requestUrl: "http://example.com",
      timestamp: 0,
      responseStatus: 200,
      responseTime: 4,
      probeName: null,
      requestHeader: null,
      requestBody: null,
      responseHeader: null,
      responseBody: null,
      responseSize: 400,
    },
    {
      id: 2,
      reportId: 1,
      probeId: "POST example.com",
      requestMethod: "POST",
      requestUrl: "http://example.com",
      timestamp: 0,
      responseStatus: 200,
      responseTime: 4,
      probeName: null,
      requestHeader: null,
      requestBody: null,
      responseHeader: null,
      responseBody: null,
      responseSize: 400,
    },
    {
      id: 3,
      reportId: 2,
      probeId: "2 GET example.com",
      requestMethod: "GET",
      requestUrl: "http://example.com",
      timestamp: 0,
      responseStatus: 200,
      responseTime: 4,
      probeName: null,
      requestHeader: null,
      requestBody: null,
      responseHeader: null,
      responseBody: null,
      responseSize: 400,
    },
  ];
  const mockfindMany = jest.fn();
  const app = express();
  app.use(reportRequestService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../../../prisma/prisma-client");

    PrismaClient.reportRequests.findMany = mockfindMany.mockImplementation(
      async (): Promise<Array<reportRequests>> => reportRequestData,
    );
  });

  describe("GET /v1/report-requests", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).get("/v1/report-requests");

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportRequestData);

      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockfindMany.mockImplementationOnce(
        async (): Promise<reportRequests[]> => {
          throw new Error("query error");
        },
      );

      // act
      const res = await request(app).get("/v1/report-requests");

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 200 with parameters", async done => {
      // act
      const res = await request(app).get(`/v1/report-requests?fields=id`);

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportRequestData);

      done();
    });
  });
});
