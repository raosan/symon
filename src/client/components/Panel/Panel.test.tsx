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

import { Panel } from "./Panel";
import { render, screen } from "@testing-library/react";

describe("renders Panel", () => {
  it("renders with correct title", () => {
    render(<Panel title="Login" />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders provided child content", () => {
    render(<Panel title="Login">Panel Content</Panel>);
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  it("renders primary color", () => {
    render(<Panel title="Login" />);
    expect(screen.getByTestId("panel-title")).toHaveClass("bg-primary");
    expect(screen.getByTestId("panel-content")).toHaveClass(
      "bg-primary-lighter",
    );
  });

  it("renders secondary color", () => {
    render(<Panel title="Login" color="secondary" />);
    expect(screen.getByTestId("panel-title")).toHaveClass("bg-secondary");
    expect(screen.getByTestId("panel-content")).toHaveClass(
      "bg-secondary-lighter",
    );
  });
});
