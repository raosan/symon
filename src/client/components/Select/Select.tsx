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

import { Attributes, FC, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * List of options to select from
   */
  options: Option[];
}

type Option = {
  id?: Attributes["key"];
  name: string;
  value: HTMLOptionElement["value"];
  [key: string]: unknown;
};

/**
 * Select component
 */
export const Select: FC<SelectProps> = ({ options, ...rest }) => {
  return (
    <select
      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md ${
        rest.disabled ? "bg-gray-200" : ""
      }`}
      {...rest}
    >
      {options.map((option, index) => (
        <option key={option.id ?? index} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
