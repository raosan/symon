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

export interface User {
  id: number;
  email: string;
  password_hash: string;
  enabled: number;
  suspended: number;
  created_at: number;
  updated_at: number;
  created_by: string;
  updated_by: string;
}

export interface UserInput {
  email: string;
  password_hash: string;
  enabled: number;
  suspended: number;
  created_at: number;
  updated_at: number;
  created_by: string;
  updated_by: string;
}

export interface UserUpdate {
  id: number;
  enabled: number;
  suspended: number;
  updated_at: number;
}
