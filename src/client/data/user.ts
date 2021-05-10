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

import { useMutation, UseMutationResult } from "react-query";

import { post } from "./requests";

type UseLoginData = {
  result: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

type UseLoginVariables = { email: string; password: string };

export const useLogin = (): UseMutationResult<
  UseLoginData,
  Error,
  UseLoginVariables,
  unknown
> => {
  return useMutation(async variables => post("/auth", { body: variables }), {
    onSuccess(response) {
      setToken(response.data);
    },
    onError() {
      // do nothing
    },
  });
};

export const setToken = (data: {
  accessToken: string;
  refreshToken: string;
}): void => {
  const { accessToken, refreshToken } = data;

  if (accessToken) {
    window.localStorage.setItem("at", accessToken);
    if (refreshToken) {
      window.localStorage.setItem("rt", refreshToken);
    }
  } else {
    window.localStorage.removeItem("at");
    window.localStorage.removeItem("rt");
  }
};

export const getSavedTokens = (): {
  accessToken: string;
  refreshToken: string;
} => {
  return {
    accessToken: window.localStorage.getItem("at") || "",
    refreshToken: window.localStorage.getItem("rt") || "",
  };
};
