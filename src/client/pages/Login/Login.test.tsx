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

import { LoginView } from "./Login";
import { render, screen } from "@testing-library/react";

describe("renders Login", () => {
  it("has input for email", () => {
    const { container } = render(<LoginView />);
    const usernameInput = container.querySelector("input#email");
    expect(usernameInput).toBeInTheDocument();
  });

  it("has label for email input", () => {
    render(<LoginView />);
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
  });

  it("has input for password", () => {
    const { container } = render(<LoginView />);
    const usernameInput = container.querySelector("input#password");
    expect(usernameInput).toBeInTheDocument();
  });

  it("has label for password input", () => {
    render(<LoginView />);
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });
});
