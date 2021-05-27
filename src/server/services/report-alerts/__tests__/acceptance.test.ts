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

import { reportRequestAlerts } from "@prisma/client";
import express from "express";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import reportRequestAlertService from "../index";
import PrismaClient from "../../../prisma/prisma-client";

describe("Report request alert service", () => {
  // arrange
  const reportRequestAlertsData = [
    {
      id: 1,
      alert: "response-time-greater-than-100-ms",
      request: {
        id: 1,
        reportId: 2,
        timestamp: 1621559546,
        probeId: "httpbin",
        probeName: "probe httpbin",
        requestMethod: "get",
        requestUrl: "https://httpbin.org/get",
        requestHeader:
          '{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.21.1"}',
        requestBody: null,
        responseStatus: 200,
        responseHeader:
          '{"date":"Fri, 21 May 2021 01:12:26 GMT","content-type":"application/json","content-length":"288","connection":"close","server":"gunicorn/19.9.0","access-control-allow-origin":"*","access-control-allow-credentials":"true"}',
        responseBody: null,
        responseTime: 846,
        responseSize: 288,
      },
    },
    {
      id: 2,
      alert: "response-time-greater-than-100-ms",
      request: {
        id: 2,
        reportId: 4,
        timestamp: 1621918558,
        probeId: "httpbin",
        probeName: "probe httpbin",
        requestMethod: "get",
        requestUrl: "https://httpbin.org/get",
        requestHeader:
          '{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.21.1"}',
        requestBody: null,
        responseStatus: 200,
        responseHeader:
          '{"date":"Tue, 25 May 2021 04:55:57 GMT","content-type":"application/json","content-length":"284","connection":"close","server":"gunicorn/19.9.0","access-control-allow-origin":"*","access-control-allow-credentials":"true"}',
        responseBody: null,
        responseTime: 1659,
        responseSize: 284,
      },
    },
    {
      id: 3,
      alert: "response-time-greater-than-100-ms",
      request: {
        id: 3,
        reportId: 7,
        timestamp: 1621918568,
        probeId: "httpbin",
        probeName: "probe httpbin",
        requestMethod: "get",
        requestUrl: "https://httpbin.org/get",
        requestHeader:
          '{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.21.1"}',
        requestBody: null,
        responseStatus: 200,
        responseHeader:
          '{"date":"Tue, 25 May 2021 04:56:07 GMT","content-type":"application/json","content-length":"284","connection":"close","server":"gunicorn/19.9.0","access-control-allow-origin":"*","access-control-allow-credentials":"true"}',
        responseBody: null,
        responseTime: 2104,
        responseSize: 284,
      },
    },
  ];
  const mockfindMany = jest.fn();
  const app = express();
  app.use(reportRequestAlertService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../../../prisma/prisma-client");

    PrismaClient.reportRequestAlerts.findMany = mockfindMany.mockImplementation(
      async () => reportRequestAlertsData,
    );
  });

  describe("GET /v1/report-alerts", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).get("/v1/report-alerts");

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportRequestAlertsData);

      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockfindMany.mockImplementationOnce(
        async (): Promise<reportRequestAlerts[]> => {
          throw new Error("query error");
        },
      );

      // act
      const res = await request(app).get("/v1/report-alerts");

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 200 with parameters", async done => {
      // act
      const res = await request(app).get(`/v1/report-alerts?fields=id`);

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportRequestAlertsData);

      done();
    });
  });
});
