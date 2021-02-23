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

import { Router } from "express";

import validate from "../../internal/middleware/validator";
import {
  index,
  create,
  show,
  update,
  destroy,
  schedule,
  start,
  stop,
} from "./controller";
import { createValidator, scheduleValidator } from "./validator";

const router = Router();

router.get("/v1/projects/:id/probes", index);
router.post("/v1/projects/:id/probes", validate(createValidator), create);
router.get("/v1/probes/:id", show);
router.put("/v1/probes/:id", validate(createValidator), update);
router.delete("/v1/probes/:id", destroy);
router.put("/v1/probes/:id/start", start);
router.put("/v1/probes/:id/stop", stop);
router.put("/v1/probes/:id/schedule", validate(scheduleValidator), schedule);

export default router;
