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

import { Select } from "./Select";
import { fireEvent, render, screen } from "@testing-library/react";

describe("renders Select", () => {
  const options = [
    { name: "Indonesia", value: "id" },
    { name: "Malaysia", value: "my" },
    { name: "Singapore", value: "sg" },
    { name: "United Kingdom", value: "gb" },
    { name: "United States of America", value: "us" },
  ];

  it("shows all provided options", () => {
    render(<Select options={options} />);
    options.forEach(option => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
  });

  it("has correct value attribute for each option", () => {
    render(<Select options={options} />);
    options.forEach(option => {
      const element = screen.getByText(option.name);
      expect(element).toHaveAttribute("value", option.value);
    });
  });

  it("handles select change event", () => {
    const handleChange = jest.fn();

    const { container } = render(
      <Select options={options} onChange={handleChange} />,
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.change(container.querySelector("select")!, {
      target: { value: options[0].value },
    });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0].target.value).toBe(options[0].value);
  });

  it("turns gray when disabled", () => {
    const { container } = render(<Select options={options} disabled />);

    expect(container.querySelector("select")).toHaveClass("bg-gray-200");
  });
});
