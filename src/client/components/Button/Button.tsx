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

import { FC } from "react";

export interface ButtonProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * How big is the button
   */
  size?: "small" | "medium" | "large";
  /**
   * Background color of the button
   */
  color?: "green" | "gray";
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Button component
 */
export const Button: FC<ButtonProps> = ({
  label,
  size = "medium",
  color = "green",
  ...props
}) => {
  return (
    <button
      type="button"
      className={[
        "text-white rounded-lg",
        size === "small"
          ? "w-32 h-8 text-sm"
          : size === "medium"
          ? "w-36 h-10 text-base"
          : "w-44 h-12 text-xl",
        color === "green" ? "bg-green-700" : "bg-gray-500",
      ].join(" ")}
      {...props}
    >
      {label}
    </button>
  );
};
