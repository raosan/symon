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

import { render, screen } from "@testing-library/react";
import { SetupView, SetupDatabase, CreateAccount, Finish } from "./Setup";

describe("SetupView", () => {
  it("should display database setup form", () => {
    render(
      <SetupView
        currentStep={1}
        onSetupDatabase={jest.fn()}
        onCreateAccount={jest.fn()}
        onFinish={jest.fn()}
      />,
    );

    expect(screen.getByText(/Let’s get started./)).toBeInTheDocument();
  });

  it("should display create account form", () => {
    render(
      <SetupView
        currentStep={2}
        onSetupDatabase={jest.fn()}
        onCreateAccount={jest.fn()}
        onFinish={jest.fn()}
      />,
    );

    expect(screen.getByText(/Create account/)).toBeInTheDocument();
  });

  it("should display finish step", () => {
    render(
      <SetupView
        currentStep={3}
        onSetupDatabase={jest.fn()}
        onCreateAccount={jest.fn()}
        onFinish={jest.fn()}
      />,
    );

    expect(screen.getByText(/Finishing setup/)).toBeInTheDocument();
  });
});

describe("SetupDatabase", () => {
  it("has input for database option", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("select#database");
    expect(element).toBeInTheDocument();
  });
  it("has input for host", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("input#host");
    expect(element).toBeInTheDocument();
  });
  it("has input for port", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("input#port");
    expect(element).toBeInTheDocument();
  });
  it("has input for schema", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("input#schema");
    expect(element).toBeInTheDocument();
  });
  it("has input for database user", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("input#user");
    expect(element).toBeInTheDocument();
  });
  it("has input for database password", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector("input#password");
    expect(element).toBeInTheDocument();
  });
  it("has next button", () => {
    const { container } = render(<SetupDatabase onNext={jest.fn()} />);
    const element = container.querySelector('button[type="submit"]');
    expect(element).toBeInTheDocument();
  });
});

describe("CreateAccount", () => {
  it("has input for username", () => {
    const { container } = render(<CreateAccount onNext={jest.fn()} />);
    const element = container.querySelector("input#username");
    expect(element).toBeInTheDocument();
  });
  it("has input for email", () => {
    const { container } = render(<CreateAccount onNext={jest.fn()} />);
    const element = container.querySelector("input#email");
    expect(element).toBeInTheDocument();
  });
  it("has input for password", () => {
    const { container } = render(<CreateAccount onNext={jest.fn()} />);
    const element = container.querySelector("input#password");
    expect(element).toBeInTheDocument();
  });
  it("has next button", () => {
    const { container } = render(<CreateAccount onNext={jest.fn()} />);
    const element = container.querySelector('button[type="submit"]');
    expect(element).toBeInTheDocument();
  });
});

describe("Finish", () => {
  it("has finish button", () => {
    const { container } = render(<Finish onFinish={jest.fn()} />);
    const element = container.querySelector("button");
    expect(element).toBeInTheDocument();
  });
});
