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

import { Button } from "./Button";
import { render, screen } from "@testing-library/react";

it("renders with correct label", () => {
  render(<Button label="Login" />);
  expect(screen.getByText("Login")).toBeInTheDocument();
});

describe("renders button with correct size", () => {
  it("renders a small button", () => {
    const { container } = render(<Button label="Button" size="small" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-32", "h-8", "text-sm");
  });

  it("renders a medium button", () => {
    const { container } = render(<Button label="Button" size="medium" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-36", "h-10", "text-base");
  });

  it("renders a large button", () => {
    const { container } = render(<Button label="Button" size="large" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-44", "h-12", "text-xl");
  });
});

describe("renders button with correct color", () => {
  it("renders a dark button", () => {
    const { container } = render(<Button label="Button" variant="dark" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-bw");
  });

  it("renders a light button", () => {
    const { container } = render(<Button label="Button" variant="light" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-white", "border", "border-black");
  });
});
