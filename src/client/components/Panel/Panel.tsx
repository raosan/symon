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

export interface PanelProps {
  title: string;
  color?: "primary" | "secondary";
}

export const Panel: FC<PanelProps> = ({
  title,
  color = "primary",
  children,
}) => {
  const [bgColorPrimary, bgColorSecondary] =
    color === "secondary"
      ? ["bg-secondary", "bg-secondary-lighter"]
      : [`bg-primary`, "bg-primary-lighter"];

  return (
    <div>
      <div
        className={`${bgColorPrimary} px-8 py-4 text-white text-xl mb-1 shadow-lg`}
        data-testid="panel-title"
      >
        {title}
      </div>
      <div
        className={`${bgColorSecondary} px-8 py-4 shadow-md`}
        data-testid="panel-content"
      >
        {children}
      </div>
    </div>
  );
};
