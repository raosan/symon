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
import faker from "faker";
import request from "supertest";

import { monika } from "@prisma/client";

import errorHandler from "../../../internal/middleware/error-handler";
import { Repository as ApiKeyRepository } from "../../api-keys/repository";
import { MonikaHandshakeCreate, ReportCreate } from "../entity";
import monikaService from "../index";
import { MonikaRepository, ReportRepository } from "../repository";

const handshakes: monika[] = [
  {
    id: 1,
    hostname: faker.internet.domainName(),
    instanceId: faker.random.uuid(),
  },
];

describe("Monika Handshake Service", () => {
  const app = express();

  app.use(express.json());
  app.use(monikaService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");
    jest.mock("../../api-keys/repository");

    MonikaRepository.prototype.createHandshake = async (
      input: MonikaHandshakeCreate,
    ) => {
      const createdHandshake = {
        id: 2,
        version: faker.random.uuid(),
        ...input,
      };

      handshakes.push(createdHandshake);

      return {
        status: 201,
        data: createdHandshake,
      };
    };

    ApiKeyRepository.prototype.findByApiKey = async () => {
      const data = {
        id: 1,
        projectID: 1,
        name: "EC2 AWS Jakarta",
        apiKey: "123",
        isEnabled: true,
        createdBy: "1",
        updatedBy: "1",
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      };

      return data;
    };
  });

  describe("POST /v1/monika/handshake", () => {
    it("should return http status code 201", async done => {
      const res = await request(app)
        .post("/v1/monika/handshake")
        .set({ "x-api-key": "123" })
        .send({
          hostname: faker.random.uuid(),
          instanceId: faker.random.uuid(),
        });

      expect(res.status).toBe(201);
      expect(handshakes.length).toBe(2);

      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/monika/handshake").send({
        id: 2,
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      MonikaRepository.prototype.createHandshake = async (
        data: MonikaHandshakeCreate,
      ) => {
        throw new Error(`query error with instanceId: ${data.instanceId}`);
      };

      const res = await request(app)
        .post("/v1/monika/handshake")
        .set({ "x-api-key": "123" })
        .send({
          hostname: faker.random.uuid(),
          instanceId: faker.random.uuid(),
        });

      expect(res.status).toBe(422);
      done();
    });
  });
});

describe("Monika Report Service", () => {
  const app = express();

  app.use(express.json());
  app.use(monikaService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    MonikaRepository.prototype.findOneByInstanceID = async () => {
      return handshakes[0];
    };

    ReportRepository.prototype.create = async (reportCreate: ReportCreate) => {
      const createdReport = {
        id: 2,
        ...reportCreate,
        monikaId: 1,
        data: {
          requests: reportCreate.data.requests.map((d, i) => ({ id: i, ...d })),
          notifications: reportCreate.data.notifications.map((d, i) => ({
            id: i,
            ...d,
          })),
        },
      };

      return createdReport;
    };
  });

  describe("POST /v1/monika/report", () => {
    const mockData = {
      monika_instance_id: "monika123",
      config_version: "abcdef",
      data: {
        requests: [
          {
            timestamp: 1621339832,
            probe_id: "0",
            probe_name: "probe 1",
            request_method: "get",
            request_url: "https://httpbin.org/get",
            request_header:
              '{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.21.1","host":"httpbin.org"}',
            response_status: 200,
            response_header:
              '{"date":"Tue, 18 May 2021 12:10:32 GMT","content-type":"application/json","content-length":"287","connection":"close","server":"gunicorn/19.9.0","access-control-allow-origin":"*","access-control-allow-credentials":"true"}',
            response_time: 2283,
            response_size: 287,
            alerts: ["response-time-greater-than-1200-ms"],
          },
          {
            timestamp: 1621339841,
            probe_id: "0",
            probe_name: "probe 1",
            request_method: "get",
            request_url: "https://httpbin.org/get",
            request_header:
              '{"Accept":"application/json, text/plain, */*","User-Agent":"axios/0.21.1","host":"httpbin.org"}',
            response_status: 200,
            response_header:
              '{"date":"Tue, 18 May 2021 12:10:41 GMT","content-type":"application/json","content-length":"287","connection":"close","server":"gunicorn/19.9.0","access-control-allow-origin":"*","access-control-allow-credentials":"true"}',
            response_time: 1475,
            response_size: 287,
            alerts: ["response-time-greater-than-1200-ms"],
          },
        ],
        notifications: [
          {
            timestamp: 1621339832,
            probe_id: "0",
            probe_name: "probe 1",
            alert_type: "response-time-greater-than-1200-ms",
            type: "NOTIFY-INCIDENT",
            notification_id: "unique-id-webhook",
            channel: "webhook",
          },
        ],
      },
    };

    it("should return http status code 201", async () => {
      const res = await request(app)
        .post("/v1/monika/report")
        .set({ "x-api-key": "123" })
        .send(mockData);

      expect(res.status).toStrictEqual(201);
    });

    it("should return http status code 400", async () => {
      const res = await request(app)
        .post("/v1/monika/report")
        .set({ "x-api-key": "123" })
        .send({});

      expect(res.status).toEqual(400);
    });
  });
});
