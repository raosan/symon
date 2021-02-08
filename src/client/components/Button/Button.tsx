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

import { ButtonHTMLAttributes, FC } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button contents
   */
  label: string;
  /**
   * How big is the button
   */
  size?: "small" | "medium" | "large";
  /**
   * Color variant of the button
   */
  variant?: "light" | "dark";
}

/**
 * Button component
 */
export const Button: FC<ButtonProps> = ({
  label,
  size = "medium",
  variant = "dark",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`rounded-lg ${
        size === "small"
          ? "w-32 h-8 text-sm"
          : size === "medium"
          ? "w-36 h-10 text-base"
          : "w-44 h-12 text-xl"
      } ${
        variant === "light"
          ? "bg-white border border-black"
          : "bg-bw text-white "
      }`}
      {...props}
    >
      {label}
    </button>
  );
};
