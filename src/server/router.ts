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

import auth from "./services/auth";
import authMiddleware from "./services/auth/middleware";
import organizations from "./services/organizations";
import projects from "./services/projects";
import users from "./services/users";
import locations from "./services/locations";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Hello World!");
});

router.use(auth);

router.use(authMiddleware);

// ********************************
// Protected Endpoints ************
// ********************************

router.use(users);
router.use(organizations);
router.use(locations);
router.use(projects);

// ********************************
// End of Protected Endpoints *****
// ********************************

export default router;
