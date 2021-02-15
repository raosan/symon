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

import Joi from "joi";

export const findSchemaValidator = Joi.object().keys({
  offset: Joi.number().label("Offset"),
  size: Joi.number().label("Size"),
});

export const createSchemaValidator = Joi.object().keys({
  locationName: Joi.string().required().label("LocationName"),
  countryCode: Joi.string().required().label("CountryCode"),
  dataCenter: Joi.string().required().label("DataCenter"),
});

export const updateSchemaValidator = Joi.object().keys({
  locationName: Joi.string().label("LocationName"),
  countryCode: Joi.string().label("CountryCode"),
  dataCenter: Joi.string().label("DataCenter"),
});
