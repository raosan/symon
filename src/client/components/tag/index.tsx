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

type tagType = "success" | "info" | "warn" | "error";

export type tagProps = {
  children?: React.ReactNode;
  type?: tagType;
};

export default function Tag({ children, type }: tagProps): JSX.Element {
  const color = getColorByType(type);
  const backgroundColor = `bg-${color}-100`;
  const borderColor = `border-${color}-200`;

  return (
    <span
      className={`flex justify-center items-center p-2 font-medium ${backgroundColor} ${borderColor} rounded`}
    >
      {children}
    </span>
  );
}

function getColorByType(type?: tagType): string {
  switch (type) {
    case "success":
      return "green";
    case "info":
      return "blue";
    case "warn":
      return "yellow";
    case "error":
      return "red";

    default:
      return "gray";
  }
}
