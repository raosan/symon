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

export interface Location {
  entityId: number;
  locationName: string;
  countryCode: string;
  dataCenter: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
}

export interface SearchParams {
  offset: string;
  size: string;
  name: string;
  country: string;
  dataCenter: string;
  sort: string;
  order: string;
}

export type LocationCreate = Omit<Location, "entityId">;
export type LocationUpdate = Omit<Location, "createdAt" | "createdBy">;
