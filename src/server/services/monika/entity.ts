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

import { monika } from "@prisma/client";

export type MonikaHandshakeCreate = Omit<monika, "id">;

export type MonikaHandshakeUpdate = Omit<monika, "id">;

export interface Report<T = ReportData> {
  id: number;
  monikaId: number;
  monikaInstanceId: string;
  monika?: monika;
  configVersion: string;
  data: T;
}

interface ReportData {
  requests: RequestsData[];
  notifications: NotificationsData[];
}

interface RequestsData {
  id: number;
  timestamp: number;
  probeId: string;
  probeName?: string | null;
  requestUrl: string;
  requestMethod: string;
  requestHeader?: string | null;
  requestBody?: string | null;
  responseHeader?: string | null;
  responseBody?: string | null;
  responseStatus: number;
  responseTime: number;
  responseSize?: number | null;
  alerts: string[];
}

interface NotificationsData {
  id: number;
  timestamp: number;
  probeId: string;
  probeName?: string | null;
  alert: string;
  type: string;
  notificationId: string;
  channel: string;
}

export type ReportCreate = Omit<
  Report<{
    requests: Omit<RequestsData, "id">[];
    notifications: Omit<NotificationsData, "id">[];
  }>,
  "id" | "monika"
>;
